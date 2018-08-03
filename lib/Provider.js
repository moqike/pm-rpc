"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var types_1 = require("./types");
var Provider = /** @class */ (function () {
    function Provider(options) {
        var _this = this;
        this._started = false;
        this._providers = {};
        this._handleMessage = function (event) {
            var rpcData = event.data;
            // TODO: Check event.origin & targetWindow
            if (rpcData.type === types_1.C2P_MESSAGE_TYPE.RPC_REQUEST
                && _this._providers.hasOwnProperty(rpcData.provider)) {
                var provider = _this._providers[rpcData.provider];
                var methodPath = rpcData.method.split('.');
                var method = methodPath.pop();
                var context_1 = provider;
                methodPath.forEach(function (prop) {
                    context_1 = context_1[prop];
                });
                var deserializedArguments = _this._deserializeArguments(rpcData.arguments);
                var result = _this._invokeService(context_1, method, deserializedArguments);
                _this._sendResult(rpcData.uuid, result);
            }
        };
        this._providers = options.providers;
        this._targetWindow = options.targetWindow;
    }
    Provider.prototype.start = function () {
        if (!this._started) {
            this._started = true;
            window.addEventListener('message', this._handleMessage, false);
        }
    };
    Provider.prototype.stop = function () {
        if (this._started) {
            window.removeEventListener('message', this._handleMessage, false);
            this._started = false;
        }
    };
    Provider.prototype._invokeService = function (context, method, deserializedArguments) {
        var result;
        if (method) {
            result = context[method].apply(context, deserializedArguments);
        }
        else {
            result = context.apply(context, deserializedArguments);
        }
        return result;
    };
    Provider.prototype._deserializeArguments = function (args) {
        var _this = this;
        var result = args.map(function (argument) {
            var mappedArgument = argument;
            if (argument && argument.hasOwnProperty(types_1.RPC_ARG_TYPE_KEY)) {
                switch (argument[types_1.RPC_ARG_TYPE_KEY]) {
                    case types_1.RPC_ARGUMENT_TYPE.CALLBACK:
                        var self_1 = _this;
                        mappedArgument = function () {
                            // Trigger client callback
                            self_1._invokeCallback(argument.uuid, __spread(arguments));
                        };
                        break;
                    case types_1.RPC_ARGUMENT_TYPE.RUNTIME:
                        // TODO: new function
                        // result = new Function()
                        break;
                    default:
                        break;
                }
            }
            return mappedArgument;
        });
        return result;
    };
    Provider.prototype._invokeCallback = function (uuid, callbackArguments) {
        var postData = {
            type: types_1.P2C_MESSAGE_TYPE.RPC_CALLBACK,
            uuid: uuid,
            callbackArguments: callbackArguments
        };
        this._targetWindow.postMessage(postData, '*');
    };
    Provider.prototype._sendResult = function (uuid, result) {
        var postData = {
            type: types_1.P2C_MESSAGE_TYPE.RPC_RESPONSE,
            result: result,
            uuid: uuid
        };
        this._targetWindow.postMessage(postData, '*');
    };
    return Provider;
}());
exports.Provider = Provider;
exports.default = Provider;
//# sourceMappingURL=Provider.js.map