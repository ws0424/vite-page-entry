import { PluginOption } from "vite";
import vue from "@vitejs/plugin-vue";

import { setupVueJsx } from "./vue-jsx";

export const setupPlugins = (): PluginOption[] => {
  const plugins: PluginOption[] = [vue()];
  plugins.unshift(setupVueJsx());

  return plugins;
};
