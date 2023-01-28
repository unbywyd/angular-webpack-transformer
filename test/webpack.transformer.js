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
}