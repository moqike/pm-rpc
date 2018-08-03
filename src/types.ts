/**
 * RPC arguments type
 */
export enum RPC_ARGUMENT_TYPE {
  CALLBACK = 'CALLBACK',
  RUNTIME = 'RUNTIME'
}

export const RPC_ARG_TYPE_KEY = '_rpc_arg_type';

export interface SerializedCallbackFunction {
  [RPC_ARG_TYPE_KEY]: RPC_ARGUMENT_TYPE.CALLBACK;
  uuid: string;
}

export interface SerializedRuntimeFunction {
  [RPC_ARG_TYPE_KEY]: RPC_ARGUMENT_TYPE.RUNTIME;
  functionString: string;
}

export interface CallbackFunction extends SerializedCallbackFunction {
  _function: any;
}

export interface RuntimeFunction extends SerializedRuntimeFunction {
  _function: any;
}

export type RpcArgumentElem = null | undefined | boolean | string | number | object | CallbackFunction | RuntimeFunction;

export type RpcArgument = RpcArgumentElem | RpcArgumentElem[];

// TODO: add support for promise response at the provider side
export type RpcResult = null | undefined | boolean | string | number | object;

export type SerializedRpcArgumentElem = null | undefined | boolean | string | number | object
| SerializedCallbackFunction | SerializedRuntimeFunction;

export type SerializedRpcArgument = SerializedRpcArgumentElem | SerializedRpcArgumentElem[];

/**
 * Provider to Client Message Data Types
 */
export enum P2C_MESSAGE_TYPE {
  RPC_CALLBACK = 'RPC_CALLBACK',
  RPC_RESPONSE = 'RPC_RESPONSE'
}
/**
 * Client to Provider Message Data Types
 */
export enum C2P_MESSAGE_TYPE {
  RPC_REQUEST = 'RPC_REQUEST'
}

export interface RpcRequest {
  type: C2P_MESSAGE_TYPE.RPC_REQUEST;
  uuid: string;
  provider: string;
  method: string;
  arguments: SerializedRpcArgumentElem[];
}

export type C2PRpcData = RpcRequest;

export interface RpcCallback {
  type: P2C_MESSAGE_TYPE.RPC_CALLBACK;
  uuid: string;
  callbackArguments: any[];
}

export interface RpcResponse {
  type: P2C_MESSAGE_TYPE.RPC_RESPONSE;
  uuid: string;
  result: RpcResult;
}

export type P2CRpcData = RpcCallback | RpcResponse;


