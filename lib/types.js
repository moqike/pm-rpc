"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * RPC arguments type
 */
var RPC_ARGUMENT_TYPE;
(function (RPC_ARGUMENT_TYPE) {
    RPC_ARGUMENT_TYPE["CALLBACK"] = "CALLBACK";
    RPC_ARGUMENT_TYPE["RUNTIME"] = "RUNTIME";
})(RPC_ARGUMENT_TYPE = exports.RPC_ARGUMENT_TYPE || (exports.RPC_ARGUMENT_TYPE = {}));
exports.RPC_ARG_TYPE_KEY = '_rpc_arg_type';
/**
 * Provider to Client Message Data Types
 */
var P2C_MESSAGE_TYPE;
(function (P2C_MESSAGE_TYPE) {
    P2C_MESSAGE_TYPE["RPC_CALLBACK"] = "RPC_CALLBACK";
    P2C_MESSAGE_TYPE["RPC_RESPONSE"] = "RPC_RESPONSE";
})(P2C_MESSAGE_TYPE = exports.P2C_MESSAGE_TYPE || (exports.P2C_MESSAGE_TYPE = {}));
/**
 * Client to Provider Message Data Types
 */
var C2P_MESSAGE_TYPE;
(function (C2P_MESSAGE_TYPE) {
    C2P_MESSAGE_TYPE["RPC_REQUEST"] = "RPC_REQUEST";
})(C2P_MESSAGE_TYPE = exports.C2P_MESSAGE_TYPE || (exports.C2P_MESSAGE_TYPE = {}));
//# sourceMappingURL=types.js.map