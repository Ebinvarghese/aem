import {
  assetLoadersConfiguration,
  buildInfoBanner,
  commonDevConfiguration,
  commonProdConfiguration,
  javascriptLoadersConfiguration,
  rxjsExternalsConfiguration,
  sprintCommonExternals,
  styleLoadersConfiguration,
  typescriptLoadersConfiguration
} from '@sprint/common-web-configurations';
import { TsConfigPathsPlugin } from 'awesome-typescript-loader';
import * as path from 'path';
import * as process from 'process';
import * as Webpack from 'webpack';
import * as webpackMerge from 'webpack-merge';

/**
 * The base Webpack configuration contains all the common-web-configuration configurations
 * that would be used for this project.
 */
const baseConfig: Webpack.Configuration = webpackMerge.smart(
  assetLoadersConfiguration(),
  // rxjsExternalsConfiguration(),
  styleLoadersConfiguration({
    postcssLoaderConfig: {
      sourceMap: process.env.NODE_ENV === 'production',
      plugins: [
        require('autoprefixer')(),
        require('cssnano')({
          autoprefixer: false,
          mergeRules: false,
          zindex: false,
          reduceIdents: false
        })
      ]
    },
    sassLoaderConfig: {
      sourceMap: process.env.NODE_ENV === 'production',
      includePaths: [
        path.resolve(__dirname, 'node_modules/@sprint/frontend-styles/src/stylesheets/'),
        path.resolve(__dirname, 'node_modules/@sprint/soar-styles-global/src/stylesheets/'),
        path.resolve(__dirname, 'node_modules/@sprint/soar-styles-global/')
      ]
    }
  }),
  javascriptLoadersConfiguration(),
  typescriptLoadersConfiguration({
    tsLoaderConfig: {
      module: 'es6'
    }
  }),
  sprintCommonExternals(),
  process.env.NODE_ENV === 'production'
    ? commonProdConfiguration()
    : commonDevConfiguration(),
  buildInfoBanner()
);

/**
 * Common configuration variables
 */
const sprintPciBase = './apps/src/main/content/jcr_root/apps/sprint-pci/clientlibs';

/**
 * Environment configurations. The entries variable should contain all the entry points that would normally be built
 * indifferent of the environment.
 */
let entries: Webpack.Entry = {
  spa: `${sprintPciBase}/spa/src/main.ts`
};
if (process.env.RUN_ENV === 'dev') {
  entries = {
    ...entries
    // Place overrides or additional entries for the dev environment below
  };
}
if (process.env.RUN_ENV === 'qa') {
  entries = {
    ...entries
    // Place overrides or additional entries for the qa environment below
  };
}
if (process.env.RUN_ENV === 'stage') {
  entries = {
    ...entries
    // Place overrides or additional entries for the stage environment below
  };
}
const config: Webpack.Configuration = webpackMerge.smart(
  /**
   * The below two style rules are necessary to support `angular2-template-loader`.
   * Do not attempt to combine these or the webpack merge will not work properly. These
   * also have to be passed to webpack merge before the base configuration so the raw-loader
   * is the first loader in the use array.
   */
  {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: 'raw-loader'
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'raw-loader'
            }
          ]
        }
      ]
    }
  },
  baseConfig,
  {
    entry: entries,
    output: {
      path: __dirname,
      filename:
        `${sprintPciBase}/[name]/js/[name].js`,
      jsonpFunction: 'sprint-pciApp'
    },
    resolve: {
      plugins: [
        new TsConfigPathsPlugin()
      ]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'angular2-template-loader'
            }
          ]
        }
      ]
    }
  }
);

export default config;
