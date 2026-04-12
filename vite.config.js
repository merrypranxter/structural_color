import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import { resolve } from 'path';

export default defineConfig({
  plugins: [glsl()],
  root: '.',
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shaders': resolve(__dirname, 'src/shaders'),
      '@math': resolve(__dirname, 'src/math'),
      '@geometry': resolve(__dirname, 'src/geometry')
    }
  },
  assetsInclude: ['**/*.glsl', '**/*.vert', '**/*.frag'],
  css: {
    devSourcemap: true
  }
});
