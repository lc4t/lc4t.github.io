import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from "unocss";

const DEFAULT_FONTS = "-apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif";

export default defineConfig({
  shortcuts: [
    ["pbb", "flex-1 text-center text-2xl font-bold"],
    ["ph1", "text-2xl font-semibold sm:text-3xl"],
    ["ph3", "text-2xl font-semibold sm:text-2xl"],
    ["ppi", "mb-6 mt-2 italic"],
    ["ph3i", "ph3 italic"],
  ],
  theme: {
    fontFamily: {
      sans: `Computer Modern Sans, ${DEFAULT_FONTS}`,
      ui: DEFAULT_FONTS
    },
    boxShadow: {
      nav: "0 1px 8px 0 rgba(0, 51, 102, .1)"
    },
    colors: {

    },
    maxWidth: {
      content: "90ch"
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: "inline-block",
        "vertical-align": "sub"
      }
    }),
    presetTypography()
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});