import { Config } from '@stencil/core';

import { sass } from '@stencil/sass';
// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist-custom-elements',
      copy: [
        {
          src: '**/*.{svg}',
          dest: 'apps/doc/www/assets',
          warn: true,
        }
      ]
    },
    {
      type: 'www',
      // comment the following line to disable service workers in production
      // serviceWorker: null,
      // baseUrl: 'https://.local/',
    },
  ],
  plugins: [sass()],
};
