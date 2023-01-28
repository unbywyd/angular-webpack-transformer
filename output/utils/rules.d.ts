import * as webpack from 'webpack';
import { PreloaderHandlerCallback, RuleTestType } from './types';
export declare const find: (ruleType: RuleTestType, config: webpack.Configuration) => Array<webpack.RuleSetRule>;
export declare const modifyOrAddLoader: (ruleTypes: RuleTestType[] | undefined, loaderName: string, callback: PreloaderHandlerCallback, config: webpack.Configuration) => void;
