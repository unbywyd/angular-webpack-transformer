const { types, rules, modify } = require('./postcss-angular-loader/output/index');
const path = require('path');

const {
    plugin,
    ungicSassThemeIntegrator: integrator,
} = require('theme-colors-extractor');

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
    use(async config => {
        return rules.modifyOrAddLoader([types.RuleTestType.Sass, types.RuleTestType.Scss], 'sass-loader', (sassLoader, rule) => {
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