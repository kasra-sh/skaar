import { defineConfig } from 'vite';

export default defineConfig({
   esbuild: {
      jsxFactory: 'createElement',
      jsxFragment: '__FRAGMENT',
      jsxInject: `import {createElement, Fragment as __FRAGMENT} from "./jsx-runtime.js"`,
   },
});
