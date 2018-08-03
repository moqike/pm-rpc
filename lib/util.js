"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var types_1 = require("./types");
/**
 * Return the original function with required RPC argument info.
 * @param originFunction original callback function
 */
exports.Callback = function (originFunction) {
    var _a;
    var result = (_a = {},
        _a[types_1.RPC_ARG_TYPE_KEY] = types_1.RPC_ARGUMENT_TYPE.CALLBACK,
        _a.uuid = uuid_1.v1(),
        _a._function = originFunction,
        _a);
    return result;
};
/**
 * TODO: Not implemented yet
 * @param originFunction
 */
exports.Runtime = function (originFunction) {
    var _a;
    var result = (_a = {},
        _a[types_1.RPC_ARG_TYPE_KEY] = types_1.RPC_ARGUMENT_TYPE.RUNTIME,
        _a.functionString = originFunction.toString(),
        _a._function = originFunction,
        _a);
    return result;
};
//# sourceMappingURL=util.js.map