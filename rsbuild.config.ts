import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginLess } from '@rsbuild/plugin-less';
import Dotenv from 'dotenv-webpack';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginLess(),
  ],
  tools: {
    lightningcssLoader: false,
    rspack: {
      plugins: [new Dotenv()]
    }
  },
});
