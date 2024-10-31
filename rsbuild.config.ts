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
  html: {
    title: '油油',
    favicon: 'https://p2.music.126.net/cPyfIo_ZV6lfQnZa7J-HOg==/109951165991680568.jpg',
  }
});
