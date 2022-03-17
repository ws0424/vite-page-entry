import { App } from "vue";

import { setupRouter } from "./router";

export const setupPlugins = (App: App) => {
  setupRouter(App);
};
