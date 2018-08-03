import { RpcArgument } from './types';
export interface ClientOptions {
    targetWindow: Window;
}
export interface RpcCallOptions {
    timeout?: number;
}
export declare class Client {
    private _started;
    private _targetWindow;
    private _resultHandlers;
    private _timeoutHandlers;
    private _callbackMap;
    constructor(options: ClientOptions);
    start(): void;
    stop(): void;
    invoke(provider: string, method: string, args: RpcArgument[], options?: RpcCallOptions): Promise<{}>;
    private _initTimeout;
    private _serializeArguments;
    private _handleMessage;
    private _handleCallbackMessage;
    private _handleResponseMessage;
    private _cleanupTimeoutHandler;
}
export default Client;
//# sourceMappingURL=Client.d.ts.map