/// <reference types="vite/client" />

declare module '*sql-wasm.wasm?url' {
  const src: string;
  export default src;
}

declare module '*.wasm?url' {
  const src: string;
  export default src;
}
