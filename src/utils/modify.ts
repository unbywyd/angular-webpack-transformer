import * as webpack from 'webpack';
import { WebpackConfigTransformer } from './types';

export const modify = (
  config: webpack.Configuration,
  callback: (config: webpack.Configuration) => void
) => {
  let promises: Array<Promise<any>> = [];
  const end = (): void => {
    Promise.all(promises).then(() => {
      callback(config);
    });
  };
  const use = async (callback: WebpackConfigTransformer) => {
    promises.push(
      new Promise((done) => {
        Promise.resolve(callback(config)).then(done);
      })
    );
  };
  return {
    use,
    end,
  };
};
