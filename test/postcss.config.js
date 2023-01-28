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