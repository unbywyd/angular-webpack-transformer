import * as webpack from 'webpack';

export enum RuleTestTypes {
  Css = '\\.(?:css)$',
  Scss = '\\.(?:scss)$',
  Sass = '\\.(?:sass)$',
  Svg = '\\.svg$',
  Html = '\\.html$'
} 

export type RuleTestType = RuleTestTypes & RegExp;

export type WebpackConfigTransformer = (
  config: webpack.Configuration
) => webpack.Configuration | Promise<webpack.Configuration>;

export interface WebpackTransformer {
  config: WebpackConfigTransformer;
}

export type PreloaderHandlerCallback = (
  loader: webpack.RuleSetUseItem | null,
  rules?: Array<webpack.RuleSetUseItem>
) => webpack.RuleSetUseItem | void;
