import { Config } from '@stencil/core';

import { sass } from '@stencil/sass';
// https://stenciljs.com/docs/config

export const config: Config = {
  globalStyle: 'src/global/app.scss',
  globalScript: 'src/global/app.ts',
  taskQueue: 'async',
  sourceMap: true,

  outputTargets: [
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'www',
    },
  ],
  extras: {
    experimentalImportInjection: true,
  },
  plugins: [sass()],
};
