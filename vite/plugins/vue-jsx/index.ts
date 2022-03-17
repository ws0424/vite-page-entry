import vueJsx from "@vitejs/plugin-vue-jsx";
import { PluginOption } from "vite";

export function setupVueJsx(): PluginOption {
  return vueJsx({
    // options are passed on to @vue/babel-plugin-jsx
  });
}
