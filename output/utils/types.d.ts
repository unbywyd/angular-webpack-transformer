import * as webpack from 'webpack';
export declare enum RuleTestTypes {
    Css = "\\.(?:css)$",
    Scss = "\\.(?:scss)$",
    Sass = "\\.(?:sass)$",
    Svg = "\\.(?:svg)$",
    Html = "\\.(?:html)$"
}
export declare type RuleTestType = RuleTestTypes & RegExp;
export declare type WebpackConfigTransformer = (config: webpack.Configuration) => webpack.Configuration | Promise<webpack.Configuration>;
export interface WebpackTransformer {
    config: WebpackConfigTransformer;
}
export declare type PreloaderHandlerCallback = (loader: webpack.RuleSetUseItem | null, rules?: Array<webpack.RuleSetUseItem>) => webpack.RuleSetUseItem | void;
