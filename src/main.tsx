import ReactDOM from "react-dom/client";

import { App } from "./App";

("./node_modules/react-grid-layout/css/styles.css");
("./node_modules/react-resizable/css/styles.css");

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <App />
);
