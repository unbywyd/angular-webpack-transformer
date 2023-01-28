import * as webpack from 'webpack';
import { PreloaderHandlerCallback, RuleTestType } from './types';

export const find = (
  ruleType: RuleTestType,
  config: webpack.Configuration
): Array<webpack.RuleSetRule> => {
  if (!config) {
    console.warn(
      `rules.find: webpack config required! find(ruleType: RuleTestType, config: webpack.Configuration)`
    );
    return [];
  }
  if (!config.module?.rules) {
    return [];
  }
  let rules = config.module.rules as Array<webpack.RuleSetRule>;

  return rules.filter((rule) => {
    return (
      'object' == typeof rule &&
      rule?.test?.toString() == new RegExp(ruleType, 'i').toString()
    );
  });
};

export const modifyOrAddLoader = (
  ruleTypes: Array<RuleTestType> = [],
  loaderName: string,
  callback: PreloaderHandlerCallback,
  config: webpack.Configuration
): void => {
  if (!config) {
    console.warn(
      `modifyLoaders: webpack config required! modifyLoaders(ruleType: RuleTestType, loaderName: string, cb: PreloaderHandler, config: webpack.Configuration)`
    );
    return;
  }
  const rules: Array<webpack.RuleSetRule> = [];

  for (let ruleType of ruleTypes) {
    rules.push(...find(ruleType, config));
  }
  if (!rules.length) {
    return;
  }
  for (let ruleTest of rules) {
    for (let rule of ruleTest.rules as Array<webpack.RuleSetRule>) {
      if ('object' == typeof rule && Array.isArray(rule?.use)) {
        const loaders = rule?.use?.filter((use) => {
          return (
            ('string' == typeof use &&
              use
                .trim()
                .toLocaleLowerCase()
                .includes(loaderName.trim().toLocaleLowerCase())) ||
            ('object' == typeof use &&
              use.loader
                ?.trim()
                .toLocaleLowerCase()
                .includes(loaderName.trim().toLocaleLowerCase()))
          );
        });
        if (loaders.length) {
          for (let loader of loaders) {
            let indexOf = rule?.use.indexOf(loader);
            let _loader: webpack.RuleSetUseItem =
              'string' == loader
                ? {
                    loader: 'loaderName',
                    options: {},
                  }
                : loader;

            let result = callback(_loader, rule.use);
            if (result) {
              rule?.use.splice(indexOf, 1, result);
            }
          }
        } else {
          callback(null, rule.use);
        }
      }
    }
  }
};
