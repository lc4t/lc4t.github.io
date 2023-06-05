/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
import type { AttributifyAttributes } from "@unocss/preset-attributify";

interface Attributes extends AttributifyAttributes {}

declare global {
  namespace astroHTML.JSX {
    /* eslint-disable-next-line */
    interface HTMLAttributes extends Attributes {}
  }
}

declare module "solid-js" {
  namespace JSX {
    /* eslint-disable-next-line */
    interface HTMLAttributes<T> extends Attributes {}
  }
}
