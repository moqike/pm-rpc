"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var types_1 = require("./types");
var Client = /** @class */ (function () {
    function Client(options) {
        var _this = this;
        this._started = false;
        this._resultHandlers = {};
        this._timeoutHandlers = {};
        this._callbackMap = {};
        this._handleMessage = function (event) {
            var rpcData = event.data;
            // TODO: Check event.origin & targetWindow
            if (rpcData && rpcData.type) {
                switch (rpcData.type) {
                    case types_1.P2C_MESSAGE_TYPE.RPC_CALLBACK:
                        _this._handleCallbackMessage(rpcData.uuid, rpcData.callbackArguments);
                        break;
                    case types_1.P2C_MESSAGE_TYPE.RPC_RESPONSE:
                        _this._handleResponseMessage(rpcData.uuid, rpcData.result);
                        break;
                    default:
                        break;
                }
            }
        };
        this._targetWindow = options.targetWindow;
    }
    Client.prototype.start = function () {
        if (!this._started) {
            this._started = true;
            window.addEventListener('message', this._handleMessage, false);
        }
    };
    Client.prototype.stop = function () {
        if (this._started) {
            window.removeEventListener('message', this._handleMessage, false);
            this._started = false;
        }
    };
    Client.prototype.invoke = function (provider, method, args, options) {
        if (options === void 0) { options = {
            timeout: 10000
        }; }
        var serializedArguments = this._serializeArguments(args);
        var rpcUuid = uuid_1.v1();
        var resultHanlder = {};
        var result = new Promise(function (resolve, reject) {
            resultHanlder.resolve = resolve;
            resultHanlder.reject = reject;
        });
        var postData = {
            type: types_1.C2P_MESSAGE_TYPE.RPC_REQUEST,
            uuid: rpcUuid,
            provider: provider,
            method: method,
            arguments: serializedArguments
        };
        this._resultHandlers[rpcUuid] = resultHanlder;
        this._targetWindow.postMessage(postData, '*');
        if (options.timeout) {
            this._initTimeout(rpcUuid, options.timeout);
        }
        return result;
    };
    Client.prototype._initTimeout = function (uuid, timeout) {
        var _this = this;
        this._timeoutHandlers[uuid] = setTimeout(function () {
            _this._cleanupTimeoutHandler(uuid);
            if (_this._resultHandlers.hasOwnProperty(uuid)) {
                var resultHandler = _this._resultHandlers[uuid];
                resultHandler.reject({
                    msg: "RPC time out. (" + timeout + "ms)"
                });
                resultHandler.reject = null;
                resultHandler.resolve = null;
                delete _this._resultHandlers[uuid];
            }
        }, timeout);
    };
    Client.prototype._serializeArguments = function (args) {
        var _this = this;
        return args.map(function (argument) {
            var _a, _b;
            var result = argument;
            if (argument && argument.hasOwnProperty(types_1.RPC_ARG_TYPE_KEY)) {
                var type = argument[types_1.RPC_ARG_TYPE_KEY];
                switch (type) {
                    case types_1.RPC_ARGUMENT_TYPE.CALLBACK:
                        var callbackArgument = argument;
                        _this._callbackMap[callbackArgument.uuid] = callbackArgument._function;
                        result = (_a = {},
                            _a[types_1.RPC_ARG_TYPE_KEY] = callbackArgument[types_1.RPC_ARG_TYPE_KEY],
                            _a.uuid = callbackArgument.uuid,
                            _a);
                        break;
                    case types_1.RPC_ARGUMENT_TYPE.RUNTIME:
                        var runtimeArgument = argument;
                        result = (_b = {},
                            _b[types_1.RPC_ARG_TYPE_KEY] = runtimeArgument[types_1.RPC_ARG_TYPE_KEY],
                            _b.functionString = runtimeArgument.functionString,
                            _b);
                        break;
                    default:
                        break;
                }
            }
            return result;
        });
    };
    Client.prototype._handleCallbackMessage = function (uuid, callbackArguments) {
        if (this._callbackMap.hasOwnProperty(uuid)) {
            var callback = this._callbackMap[uuid];
            this._callbackMap[uuid].apply(callback, callbackArguments);
        }
    };
    Client.prototype._handleResponseMessage = function (uuid, result) {
        this._cleanupTimeoutHandler(uuid);
        if (this._resultHandlers.hasOwnProperty(uuid)) {
            var resultHandler = this._resultHandlers[uuid];
            resultHandler.resolve(result);
        }
    };
    Client.prototype._cleanupTimeoutHandler = function (uuid) {
        if (this._timeoutHandlers.hasOwnProperty(uuid)) {
            clearTimeout(this._timeoutHandlers[uuid]);
            delete this._timeoutHandlers[uuid];
        }
    };
    return Client;
}());
exports.Client = Client;
exports.default = Client;
//# sourceMappingURL=Client.js.map