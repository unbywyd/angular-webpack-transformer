import * as webpack from 'webpack';
import { WebpackConfigTransformer } from './types';
export declare const modify: (config: webpack.Configuration, callback: (config: webpack.Configuration) => void) => {
    use: (callback: WebpackConfigTransformer) => Promise<void>;
    end: () => void;
};
