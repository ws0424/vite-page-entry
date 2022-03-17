import { ConfigEnv, loadEnv, UserConfigExport } from "vite";
import { setupPlugins } from "./vite/plugins/index";
import alias from "./vite/alias";
import { rollupInput } from "./vite/utils";
export default ({ mode, command }: ConfigEnv): UserConfigExport => {
  const root = process.cwd(),
    env = loadEnv(mode, root),
    plugins = setupPlugins(),
    port = env.VITE_PORT ? Number(env.VITE_PORT) : 3366;

  return {
    base: "./",
    plugins,
    resolve: {
      alias,
    },
    server: {
      host: "0.0.0.0",
      port: port,
    },
    build: {
      target: "modules",
      rollupOptions: {
        input: rollupInput(command, port),
      },
    },
  };
};
