import { defineConfig } from "unocss";
import presetIcons from "@unocss/preset-icons";
import { presetWind3 } from "unocss";

export default defineConfig({
  presets: [presetWind3(), presetIcons()],
});
