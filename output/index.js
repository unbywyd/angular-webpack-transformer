"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utils = exports.rules = exports.types = void 0;
const path = require('path');
const fs = require("fs");
const modify_1 = require("./utils/modify");
exports.types = require("./utils/types");
exports.rules = require("./utils/rules");
exports.utils = require("./utils/modify");
const plugin = {
    config(config) {
        const rootTransformFile = path.join(process.cwd(), 'webpack.transformer.js');
        if (fs.existsSync(rootTransformFile)) {
            const configFile = require(rootTransformFile);
            if ('function' == typeof configFile) {
                return new Promise((done) => {
                    let instance = (0, modify_1.modify)(config, (config) => {
                        done(config);
                    });
                    const useCallback = instance.use.bind(instance);
                    Promise.resolve(configFile(config, useCallback)).then(() => {
                        instance.end();
                    });
                });
            }
        }
        else {
            console.warn(`webpack.transformer.js not exists`);
        }
        return Promise.resolve(config);
    },
};
exports.default = plugin;
//# sourceMappingURL=index.js.map