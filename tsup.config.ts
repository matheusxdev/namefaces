import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    // Avoid deleting dist while Vite (or a parallel build) is reading it —
    // mid-clean races surface as missing named exports / invalid JS syntax.
    clean: false,
    sourcemap: true,
    treeshake: true,
  },
  {
    entry: {
      'react/index': 'src/react/index.ts',
    },
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    sourcemap: true,
    treeshake: true,
    external: ['react', 'react/jsx-runtime'],
  },
])
