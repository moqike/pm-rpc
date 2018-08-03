## Install
```
npm i --save mqk-pm-rpc
```
## Usage
#### Init RPC provider
```ts
import { Provider } from 'mqk-pm-rpc';
const provider = new Provider({
  providers: {
    [providerName]: Provider
  },
  targetWindow
});

provider.start();

// Stop listen as you wish
provider.stop();
```

#### Init RPC invokder
```ts
import { Client } from 'mqk-pm-rpc';
const client = new Client({
  targetWindow
});

client.start();

// Stop listen as you wish
client.stop();
```

#### Remote procedure call
```ts
client.invoke('dialog', 'show', ['title']);
```

#### Helper function
Callback function arguments
```ts
import { Callback } from 'mqk-pm-rpc';
const result = client.invoke('dialog', 'show', ['title', Callback(function(){
  console.log('dialog closed')
})]);
result.then(function(rpcResult) {
  console.log(rpcResult);
};

```

TODO: Runtime function arguments
```ts
import { Runtime } from 'mqk-pm-rpc';
client.invoke('dialog', 'show', ['title', Runtime(function(a, b){
  return a + b;
})]);
```
