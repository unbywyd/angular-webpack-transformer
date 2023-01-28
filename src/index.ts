const path = require('path');
import * as fs from 'fs';
import * as webpack from 'webpack';
import { WebpackTransformer } from './utils/types';
import { modify } from './utils/modify';

export * as types from './utils/types';
export * as rules from './utils/rules';
export * as utils from './utils/modify';

const plugin: WebpackTransformer = {
  config(config: webpack.Configuration) {
    const rootTransformFile = path.join(
      process.cwd(),
      'webpack.transformer.js'
    );
    if (fs.existsSync(rootTransformFile)) {
      const configFile = require(rootTransformFile);
      if ('function' == typeof configFile) {
        return new Promise((done) => {
          let instance = modify(config, (config) => {
            done(config);
          });
          const useCallback = instance.use.bind(instance);
          Promise.resolve(configFile(config, useCallback)).then(() => {
            instance.end();
          });
        });
      }
    } else {
      console.warn(`webpack.transformer.js not exists`);
    }
    return Promise.resolve(config);
  },
};

export default plugin;
