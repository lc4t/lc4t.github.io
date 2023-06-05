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
  shortcuts: [],
  theme: {
    fontFamily: {
      sans: `Computer Modern Sans, ${DEFAULT_FONTS}`,
      ui: DEFAULT_FONTS
    },
    boxShadow: {
      nav: "0 1px 8px 0 rgba(0, 51, 102, .1)"
    },
    colors: {
      brand: "#1772d0"
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