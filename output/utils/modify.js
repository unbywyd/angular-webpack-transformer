"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modify = void 0;
const modify = (config, callback) => {
    let promises = [];
    const end = () => {
        Promise.all(promises).then(() => {
            callback(config);
        });
    };
    const use = async (callback) => {
        promises.push(new Promise((done) => {
            Promise.resolve(callback(config)).then(done);
        }));
    };
    return {
        use,
        end,
    };
};
exports.modify = modify;
//# sourceMappingURL=modify.js.map