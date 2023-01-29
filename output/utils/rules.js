"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modifyOrAddLoader = exports.find = void 0;
const find = (ruleType, config) => {
    if (!config) {
        console.warn(`rules.find: webpack config required! find(ruleType: RuleTestType, config: webpack.Configuration)`);
        return [];
    }
    if (!config.module?.rules) {
        return [];
    }
    let rules = config.module.rules;
    return rules.filter((rule) => {
        return ("object" == typeof rule &&
            rule?.test?.toString() == new RegExp(ruleType, "i").toString());
    });
};
exports.find = find;
const modifyOrAddLoader = (ruleTypes = [], loaderName, callback, config) => {
    if (!config) {
        console.warn(`modifyLoaders: webpack config required! modifyLoaders(ruleType: RuleTestType, loaderName: string, cb: PreloaderHandler, config: webpack.Configuration)`);
        return;
    }
    const rules = [];
    for (let ruleType of ruleTypes) {
        let found = (0, exports.find)(ruleType, config);
        if (!found.length) {
            let rule = {
                test: RegExp(ruleType, "i"),
                rules: [
                    {
                        use: [],
                    },
                ],
            };
            config.module?.rules?.push(rule);
            rules.push(rule);
        }
        else {
            rules.push(...found);
        }
    }
    for (let ruleTest of rules) {
        if (!ruleTest.rules) {
            ruleTest.rules = [];
        }
        for (let rule of ruleTest.rules) {
            if ("object" == typeof rule && Array.isArray(rule?.use)) {
                const loaders = rule?.use?.filter((use) => {
                    return (("string" == typeof use &&
                        use
                            .trim()
                            .toLocaleLowerCase()
                            .includes(loaderName.trim().toLocaleLowerCase())) ||
                        ("object" == typeof use &&
                            use.loader
                                ?.trim()
                                .toLocaleLowerCase()
                                .includes(loaderName.trim().toLocaleLowerCase())));
                });
                if (loaders.length) {
                    for (let loader of loaders) {
                        let indexOf = rule?.use.indexOf(loader);
                        let _loader = "string" == loader
                            ? {
                                loader: "loaderName",
                                options: {},
                            }
                            : loader;
                        let result = callback(_loader, rule.use);
                        if (result) {
                            rule?.use.splice(indexOf, 1, result);
                        }
                    }
                }
                else {
                    callback(null, rule.use);
                }
            }
        }
    }
};
exports.modifyOrAddLoader = modifyOrAddLoader;
//# sourceMappingURL=rules.js.map