import { v1 as uuidv1 } from 'uuid';
import {
  C2P_MESSAGE_TYPE,
  P2C_MESSAGE_TYPE,
  RPC_ARGUMENT_TYPE,
  CallbackFunction,
  RuntimeFunction,
  P2CRpcData,
  C2PRpcData,
  RpcArgument,
  SerializedRpcArgument,
  SerializedRpcArgumentElem,
  RPC_ARG_TYPE_KEY
} from './types';

export interface ClientOptions {
  targetWindow: Window;
}

export interface RpcCallOptions {
  timeout?: number;
}

interface ResultHandler {
  resolve?: any;
  reject?: any;
}

export class Client {
  private _started = false;
  private _targetWindow: Window;
  private _resultHandlers: {
    [key: string]: ResultHandler
  } = {};
  private _timeoutHandlers: {
    [key: string]: any
  } = {};
  private _callbackMap: {
    [key: string]: any
  } = {};

  constructor(options: ClientOptions) {
    this._targetWindow = options.targetWindow;
  }

  start() {
    if (!this._started) {
      this._started = true;
      window.addEventListener('message', this._handleMessage, false);
    }
  }

  stop() {
    if (this._started) {
      window.removeEventListener('message', this._handleMessage, false);
      this._started = false;
    }
  }

  invoke(provider: string, method: string, args: RpcArgument[],
    options: RpcCallOptions = {
      timeout: 10000
    }) {
    const serializedArguments = this._serializeArgument(args) as SerializedRpcArgumentElem[];
    const rpcUuid = uuidv1();
    const resultHanlder: ResultHandler = {};
    const result = new Promise((resolve, reject) => {
      resultHanlder.resolve = resolve;
      resultHanlder.reject = reject;
    });
    const postData: C2PRpcData = {
      type: C2P_MESSAGE_TYPE.RPC_REQUEST,
      uuid: rpcUuid,
      provider,
      method,
      arguments: serializedArguments
    };
    this._resultHandlers[rpcUuid] = resultHanlder;
    this._targetWindow.postMessage(postData, '*');
    if (options.timeout) {
      this._initTimeout(rpcUuid, options.timeout);
    }

    return result;
  }

  private _initTimeout (uuid: string, timeout: number) {
    this._timeoutHandlers[uuid] = setTimeout(() => {
      this._cleanupTimeoutHandler(uuid);
      if (this._resultHandlers.hasOwnProperty(uuid)) {
        const resultHandler = this._resultHandlers[uuid];
        resultHandler.reject({
          msg: `RPC time out. (${timeout}ms)`
        });
        resultHandler.reject = null;
        resultHandler.resolve = null;
        delete this._resultHandlers[uuid];
      }
    }, timeout);
  }

  private _serializeArgument = (argument: RpcArgument): SerializedRpcArgument => {
    let result: SerializedRpcArgument = argument;
    if (Array.isArray(argument)) {
      result = argument.map(this._serializeArgument);
    } else if (argument && typeof argument === 'object') {
      if (argument.hasOwnProperty(RPC_ARG_TYPE_KEY)) {
        const type = argument[RPC_ARG_TYPE_KEY];
        switch (type) {
          case RPC_ARGUMENT_TYPE.CALLBACK:
            const callbackArgument: CallbackFunction = argument as CallbackFunction;
            this._callbackMap[callbackArgument.uuid] = callbackArgument._function;
            result = {
              [RPC_ARG_TYPE_KEY]: callbackArgument[RPC_ARG_TYPE_KEY],
              uuid: callbackArgument.uuid
            };
            break;
          case RPC_ARGUMENT_TYPE.RUNTIME:
            const runtimeArgument: RuntimeFunction = argument as RuntimeFunction;
            result = {
              [RPC_ARG_TYPE_KEY]: runtimeArgument[RPC_ARG_TYPE_KEY],
              functionString: runtimeArgument.functionString
            };
            break;
          default:
            break;
        }
      } else {
        result = {};
        // tslint:disable-next-line:forin
        for (const key in argument) {
          result[key] = this._serializeArgument(argument[key]);
        }
      }
    }

    return result;
  }

  private _handleMessage = (event: MessageEvent) => {
    const rpcData: P2CRpcData = event.data;
    // TODO: Check event.origin & targetWindow
    if (rpcData && rpcData.type) {
      switch (rpcData.type) {
        case P2C_MESSAGE_TYPE.RPC_CALLBACK:
          this._handleCallbackMessage(rpcData.uuid, rpcData.callbackArguments);
          break;
        case P2C_MESSAGE_TYPE.RPC_RESPONSE:
          this._handleResponseMessage(rpcData.uuid, rpcData.result);
          break;
        default:
          break;
      }
    }
  }

  private _handleCallbackMessage(uuid, callbackArguments) {
    if (this._callbackMap.hasOwnProperty(uuid)) {
      const callback = this._callbackMap[uuid];
      this._callbackMap[uuid].apply(callback, callbackArguments);
    }
  }

  private _handleResponseMessage(uuid, result) {
    this._cleanupTimeoutHandler(uuid);
    if (this._resultHandlers.hasOwnProperty(uuid)) {
      const resultHandler = this._resultHandlers[uuid];
      resultHandler.resolve(result);
    }
  }

  private _cleanupTimeoutHandler(uuid) {
    if (this._timeoutHandlers.hasOwnProperty(uuid)) {
      clearTimeout(this._timeoutHandlers[uuid]);
      delete this._timeoutHandlers[uuid];
    }
  }
}

export default Client;