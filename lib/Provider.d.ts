export interface Providers {
    [key: string]: any;
}
export interface ProviderOptions {
    providers: Providers;
    targetWindow: Window;
}
export declare class Provider {
    private _started;
    private _providers;
    private _targetWindow;
    constructor(options: ProviderOptions);
    start(): void;
    stop(): void;
    private _handleMessage;
    private _invokeService;
    private _deserializeArguments;
    private _invokeCallback;
    private _sendResult;
}
export default Provider;
//# sourceMappingURL=Provider.d.ts.map