import { AliasOptions } from "vite";
import { resolve } from "path";
export default {
  "@": resolve(__dirname, "../src"),
} as AliasOptions;
