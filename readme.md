# angular-webpack-transformer 

The `angular-webpack-transformer` package is a plugin that allows for asynchronous changes to the webpack configuration of an Angular project. It is dependent on the [ngx-build-plus](https://www.npmjs.com/package/ngx-build-plus) package and its documentation should be consulted for further information.

## This plugin offers the following features:

* Asynchronous modification of the webpack config file
* A simple API for quickly editing webpack loaders

## Get started

To get started, `ngx-build-plus` must be installed and configured, followed by the installation and configuration of `angular-webpack-transformer`. After that, create a file named `webpack.transformer.js` in the root of your project.

The `webpack.transformer.js` file should export a function that utilizes the use function provided by `angular-webpack-transformer` to make changes to the `webpack config`. 

The **example** file provided below adds a **postcss-loader** and configures the **sass-loader** by adding the `additionalData` option and also add two new preloaders **svg-sprite-loader** and **svgo-loader** for generating `svg sprites`

```js
const { types, rules } = require('angular-webpack-transformer');
const path = require('path');

const {
    plugin,
    ungicSassThemeIntegrator: integrator,
} = require('theme-colors-extractor');

module.exports = async function (config, use) {
 use(async config => {
        return rules.modifyOrAddLoader([types.RuleTestTypes.Sass, types.RuleTestTypes.Scss, types.RuleTestTypes.Css], 'postcss-loader', (loader, rule) => {
            if (loader) {
                return "postcss-loader";
            } else {
                rule.unshift({
                    loader: require.resolve('postcss-loader')
                });
            }
        }, config);
    });
    use(async config => {
        return rules.modifyOrAddLoader([types.RuleTestTypes.Sass, types.RuleTestTypes.Scss], 'sass-loader', (sassLoader, rule) => {
            if (sassLoader) {
                sassLoader.options.additionalData = integrator({
                    themeName: 'default',
                    themesPath: path.join(__dirname, './src/styles/configs'),
                    themeOptions: {
                        'inverse-mode': false,
                    },
                });
                return sassLoader;
            }
        }, config);
    });
    use(async config => {
        return rules.modifyOrAddLoader([types.RuleTestTypes.Svg], 'svg-sprite-loader', (loader, rule) => {
            if (!loader) {
                rule.push({
                    loader: 'svg-sprite-loader',
                    options: {
                        symbolId: filePath => "app-" + path.basename(filePath, path.extname(filePath))
                    }
                });
                rule.push('svgo-loader');
            }
        }, config);
    });
}
```

and finally use --plugin option `ng serve --plugin angular-webpack-transformer` or `ng build --plugin angular-webpack-transformer`, example of `packages.json`:

```json
"scripts": {
    "start": "ng serve --plugin angular-webpack-transformer --extra-webpack-config webpack.partial.js -o"
}
```


This package can be useful for developers who need to make custom changes to their webpack config and want an easy way to do so, without having to manually modify the config file. Additionally, the ability to asynchronously make changes to the config allows for a more efficient development process.

Please **note** that simply adding the `postcss` and `postcss-loader`, `svg-sprite-loader`, `svgo-loader` to your configuration file is not enough. You must also ensure that they are installed in your project by running the command `"npm i postcss postcss-loader"`.  Once that is done, you can use the file `postcss.config.js` to customize your postcss plugins. For example, you can use this file to add plugins such as `autoprefixer` or `cssnano` to your project


```js
// postcss.config.js
const autoprefixer = require('autoprefixer');
const postcssRtlLogicalProperties = require('postcss-rtl-logical-properties');
const postcssRTL = require('postcss-rtl');


module.exports = () => {
    return {
        plugins: [
            postcssRtlLogicalProperties(),
            autoprefixer(),
            postcssRTL({
                blacklist: postcssRtlLogicalProperties.ignoreDeclarationList,
                addPrefixToSelector: (selector, prefix) => {
                    return `${prefix} ${selector}`;
                }
            })
        ]
    }
}

```

 and for the svgo plugin, you can create the `svgo.config.js` file in the root of the project:

 ```js
module.exports = {
    datauri: 'enc', // 'base64' (default), 'enc' or 'unenc'.
    js2svg: {
        indent: 1, // string with spaces or number of spaces. 4 by default
        pretty: false, // boolean, false by default
    },
    plugins: [
        // set of built-in plugins enabled by default
        'preset-default',

        // or by expanded notation which allows to configure plugin
        "removeTitle",
        "removeDesc",
        "removeEmptyAttrs",
        "removeEmptyText",
        "removeEmptyContainers",
        "removeStyleElement",
        "removeRasterImages",
        "removeScriptElement", 
        {
            "name": "removeAttrs",
            "params": {
                attrs: '(fill|stroke|class|style|filter)' 
            }
        }
    ]
}
 ```

## API 

The function from `webpack.transformer.js` accepts two parameters:

```js

module.exports = async function (config, use) {
    return config;
}
```

The first parameter is the webpack config that can be modified, and the second parameter, `"use,"` is a method that passes the config to a **callback** for processing. This **callback** is also **asynchronous**.

The following example shows how to use the use method:

```js
const { types, rules } = require('angular-webpack-transformer');

module.exports = async function (config, use) {
    use(async config => {
        return rules.modifyOrAddLoader([types.RuleTestType.Sass, types.RuleTestType.Scss, types.RuleTestType.Css], 'postcss-loader', (loader, rule) => {
            if (loader) {
                return "postcss-loader";
            } else {
                rule.unshift({
                    loader: require.resolve('postcss-loader')
                });
            }
        }, config);
    });
}
```

##  rules.modifyOrAddLoader

The method `Rules.modifyOrAddLoader` searches for webpack loaders and provides a callback for their modification. The first callback is the loader, and the second is an array of rules. If the first element is found, return it back, otherwise, you can manually modify the array of rules.

## rules.find 
The method `Rules.find` searches for rules in the config using a `regexp`.

## types
The types can be found in the file `src/utils/types.ts`