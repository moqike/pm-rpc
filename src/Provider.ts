import {
  RPC_ARG_TYPE_KEY,
  RPC_ARGUMENT_TYPE,
  C2P_MESSAGE_TYPE,
  P2C_MESSAGE_TYPE,
  RpcCallback,
  RpcResponse,
  RpcResult,
  C2PRpcData,
  CallbackFunction,
  SerializedRpcArgument
} from './types';

export interface Providers {
  [key: string]: any;
}

export interface ProviderOptions {
  providers: Providers;
  targetWindow: Window;
  currentWindow?: Window;
}

export class Provider {
  private _started = false;
  private _providers: Providers = {};
  private _targetWindow: Window;
  private _currentWindow: Window;

  constructor(options: ProviderOptions) {
    this._providers = options.providers;
    this._targetWindow = options.targetWindow;
    this._currentWindow = options.currentWindow || window;
  }

  start () {
    if (!this._started) {
      this._started = true;
      this._currentWindow.addEventListener('message', this._handleMessage, false);
    }
  }

  stop () {
    if (this._started) {
      this._currentWindow.removeEventListener('message', this._handleMessage, false);
      this._started = false;
    }
  }

  private _handleMessage = (event: MessageEvent) => {
    const rpcData: C2PRpcData = event.data;
    // TODO: Check event.origin & targetWindow
    if (rpcData.type === C2P_MESSAGE_TYPE.RPC_REQUEST
      && this._providers.hasOwnProperty(rpcData.provider)) {
      const provider = this._providers[rpcData.provider];
      const methodPath = rpcData.method.split('.');
      const method = methodPath.pop();
      let context = provider;
      methodPath.forEach((prop) => {
        context = context[prop];
      });
      const deserializedArguments = this._deserializeArgument(rpcData.arguments);
      const result = this._invokeService(context, method, deserializedArguments);
      // Handle promise result
      if (typeof result === 'object' && result.then && result.catch) {
        result.then((asyncResult) => {
          this._sendResult(rpcData.uuid, asyncResult);
        }).catch((asyncError) => {
          this._sendResult(rpcData.uuid, asyncError, false);
        });
      } else {
        this._sendResult(rpcData.uuid, result);
      }
    }
  }

  private _invokeService (context, method, deserializedArguments) {
    let result;
    if (method) {
      result = context[method].apply(context, deserializedArguments);
    } else {
      result = context.apply(context, deserializedArguments);
    }
    return result;
  }

  private _deserializeArgument = (argument: SerializedRpcArgument) => {
    const self = this;
    let result = argument;
    if (Array.isArray(argument)) {
      result = argument.map(this._deserializeArgument);
    } else if (argument && typeof argument === 'object') {
      if (argument && argument.hasOwnProperty(RPC_ARG_TYPE_KEY)) {
        switch (argument[RPC_ARG_TYPE_KEY]) {
          case RPC_ARGUMENT_TYPE.CALLBACK:
            result = function() {
              // Trigger client callback
              self._invokeCallback((argument as CallbackFunction).uuid, [...arguments]);
            };
            break;
          case RPC_ARGUMENT_TYPE.RUNTIME:
            // TODO: new function
            // result = new Function()
            break;
          default:
            break;
        }
      } else {
        result = {};
        // tslint:disable-next-line:forin
        for (const key in argument) {
          result[key] = this._deserializeArgument(argument[key]);
        }
      }
    }
    return result;
  }

  private _invokeCallback (uuid: string, callbackArguments: any[]) {
    const postData: RpcCallback = {
      type: P2C_MESSAGE_TYPE.RPC_CALLBACK,
      uuid,
      callbackArguments
    };
    this._targetWindow.postMessage(postData, '*');
  }

  private _sendResult (uuid: string, result: RpcResult, success: boolean = true) {
    const postData: RpcResponse = {
      success,
      type: P2C_MESSAGE_TYPE.RPC_RESPONSE,
      result,
      uuid
    };
    // Serialize error info
    if (!success && postData.result) {
      postData.result = (postData.result as Error).message || postData.result.toString();
    }
    this._targetWindow.postMessage(postData, '*');
  }
}

export default Provider;