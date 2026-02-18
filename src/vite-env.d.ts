/// <reference types="vite/client" />

declare module '*.css' {
  const url: string
  export default url
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
