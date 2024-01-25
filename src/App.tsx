import "@fontsource/anek-telugu";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Layouts, Layout, Responsive, WidthProvider } from "react-grid-layout";
import useLocalStorage from "use-local-storage";
import * as R from "remeda";

import { NormalWidget } from "./components/NormalWidget";
import { ResizableWidget } from "./components/ResizableWidget";

const ResponsiveGridLayout = WidthProvider(Responsive);

export enum WidgetIdentifiers {
  PURCHASE = "purchase",
  TRANSACTION = "transaction",
  EARNINGS = "earnings",
}

enum StorageKeys {
  WIDGETS = "widgets",
  LAYOUT = "layout",
}

type LayoutsPropsOnly = Omit<Layout, "i">;
export type LayoutSizes = "sm" | "md" | "lg";

const WIDGET_LAYOUTS: Record<
  WidgetIdentifiers,
  Partial<Record<LayoutSizes, LayoutsPropsOnly>>
> = {
  purchase: {
    sm: { x: 4, y: 0, w: 2, h: 2 },
  },
  transaction: {
    sm: { x: 4, y: 0, w: 2, h: 2 },
  },
  // earnings: {
  //   sm: { x: 2, y: 0, w: 2, h: 2 },
  //   md: { x: 2, y: 0, w: 2, h: 2 },
  //   lg: { x: 2, y: 0, w: 4, h: 2 },
  // },
};

interface CustomWidget {
  indentifier: WidgetIdentifiers;
  size?: LayoutSizes;
}

const DEFAULT_WIDGET_STATE: CustomWidget[] = R.pipe(
  WIDGET_LAYOUTS,
  R.keys,
  R.map((key) => ({ indentifier: key as WidgetIdentifiers }))
);

export const App = () => {
  const [layouts, setLayout] = useLocalStorage<Layouts | undefined>(
    StorageKeys.LAYOUT,
    undefined
  );
  const [widgets, setWidgets] = useLocalStorage<CustomWidget[]>(
    StorageKeys.WIDGETS,
    DEFAULT_WIDGET_STATE
  );

  const [breakpoint, setBreakpoint] = useState('lg')

  useEffect(() => {
    if (layouts) return;
    // boostrapLayout();
  }, []);

  const boostrapLayout = useCallback(() => {
    const initial = R.map(Object.entries(WIDGET_LAYOUTS), ([key, values]) => ({
      i: key,
      ...values[Object.keys(values).shift() as LayoutSizes],
    }));

    console.log('**((((', initial)
    // setLayout(initial as Layouts);
  }, []);

  const onLayoutChange = useCallback((currentLayout: ReactGridLayout.Layout[], allLayouts: Layouts) => {
    console.log('[onLayoutChange]', {currentLayout, allLayouts})
  }, []);

  const onBreakpointChange = useCallback((newBreakpoint: string, newCols: number) => {
    setBreakpoint(newBreakpoint);
    console.log('[onBreakpointChange]', {newBreakpoint, newCols})
  }, []);

  const onWidgetUpdate = useCallback(
    (identifier: WidgetIdentifiers, size: LayoutSizes) => {
      const layoutDeepCopy = R.clone(layouts) ?? [];

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
    [layouts, widgets]
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
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      margin={[20, 20]}
      rowHeight={100}
      width={window.innerWidth}
      onBreakpointChange={onBreakpointChange}
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
    </ResponsiveGridLayout>
  );
};
