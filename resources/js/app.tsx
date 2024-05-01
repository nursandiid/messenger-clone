import "./bootstrap";
import "./echo";
import "../css/app.css";
import "../css/emoji.css";
import "../css/image-gallery.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob("./pages/**/*.tsx"),
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: {
    color: "#2563eb",
  },
});
