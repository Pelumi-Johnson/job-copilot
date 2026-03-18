export {};

declare global {
  interface Window {
    google: typeof google;
  }

  namespace google.maps {
    interface MapOptions {
      /**
       * Runtime-supported padding used by fitBounds/controls spacing.
       * Some typings versions don’t include it, so we declare it.
       */
      padding?:
        | number
        | { top?: number; right?: number; bottom?: number; left?: number };
    }
  }
}
