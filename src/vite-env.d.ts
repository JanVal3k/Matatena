/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}