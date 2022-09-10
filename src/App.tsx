import "@fontsource/anek-telugu";
import { useCallback, useEffect, useMemo } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import useLocalStorage from "use-local-storage";
import * as R from "remeda";

import { NormalWidget } from "./components/NormalWidget";
import { ResizableWidget } from "./components/ResizableWidget";

export enum WidgetIdentifiers {
  PURCHASE = "purchase",
  TRANSACTION = "transaction",
  EARNINGS = "earnings",
}

enum StorageKeys {
  WIDGETS = "widgets",
  LAYOUT = "layout",
}

type LayoutPropsOnly = Omit<Layout, "i">;
export type LayoutSizes = "sm" | "lg";

const WIDGET_LAYOUTS: Record<
  WidgetIdentifiers,
  Partial<Record<LayoutSizes, LayoutPropsOnly>>
> = {
  purchase: {
    sm: { x: 0, y: 0, w: 2, h: 2 },
  },
  transaction: {
    sm: { x: 4, y: 0, w: 2, h: 2 },
  },
  earnings: {
    sm: { x: 2, y: 0, w: 2, h: 2 },
    lg: { x: 2, y: 0, w: 4, h: 2 },
  },
};

interface CustomWidget {
  indentifier: WidgetIdentifiers;
  size?: LayoutSizes;
}

const DEFAULT_WIDGET_STATE: CustomWidget[] = Object.keys(WIDGET_LAYOUTS).map(
  (key): CustomWidget => ({ indentifier: key as WidgetIdentifiers })
);

export const App = () => {
  const [layout, setLayout] = useLocalStorage<Layout[] | undefined>(
    StorageKeys.LAYOUT,
    undefined
  );
  const [widgets, setWidgets] = useLocalStorage<CustomWidget[]>(
    StorageKeys.WIDGETS,
    DEFAULT_WIDGET_STATE
  );

  useEffect(() => {
    if (layout) return;
    boostrapLayout();
  }, []);

  const boostrapLayout = useCallback(() => {
    const initial = Object.entries(WIDGET_LAYOUTS).map(([key, values]) => ({
      i: key,
      ...values[Object.keys(values).shift() as LayoutSizes],
    }));
    setLayout(initial as Layout[]);
  }, []);

  const onLayoutChange = useCallback((newLayout: Layout[]) => {
    setLayout(newLayout);
  }, []);

  const onWidgetUpdate = useCallback(
    (identifier: WidgetIdentifiers, size: LayoutSizes) => {
      const layoutDeepCopy = R.clone(layout) ?? [];

      const updatedLayout = R.map(layoutDeepCopy, (elm) => {
        if (elm.i === identifier) {
          const { w, h } = WIDGET_LAYOUTS[identifier][size] as Layout;
          return { ...elm, w, h };
        }
        return elm;
      });

      const widgetsDeepCopy = R.clone(widgets) ?? [];

      const updatedWidgets = R.map(widgetsDeepCopy, (elm) => {
        if (elm.indentifier === identifier) {
          return { ...elm, ...(size ? { size } : {}) };
        }
        return elm;
      });

      setWidgets(updatedWidgets);
      setLayout(updatedLayout);
    },
    [layout, widgets]
  );

  const earningsProps = useMemo(
    () =>
      R.find(
        widgets,
        ({ indentifier }) => indentifier === WidgetIdentifiers.EARNINGS
      ),
    [widgets]
  );

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      margin={[20, 20]}
      rowHeight={100}
      width={1200}
      onLayoutChange={onLayoutChange}
    >
      <div key={WidgetIdentifiers.PURCHASE}>
        <NormalWidget title="Purchase" />
      </div>

      <div key={WidgetIdentifiers.TRANSACTION}>
        <NormalWidget title="Transaction" />
      </div>

      <div key={WidgetIdentifiers.EARNINGS}>
        <ResizableWidget
          title="Earnings"
          identifier={WidgetIdentifiers.EARNINGS}
          onUpdate={onWidgetUpdate}
          size={earningsProps?.size}
        />
      </div>
    </GridLayout>
  );
};
