import { Provider } from '../src/index';
const ServiceProvider = {
  print: function(text: string){
    alert(text);
    return 'ServiceProvider.print result';
  },

  delayCallback: function(delay: number, callback: (string) => any) {
    setTimeout(() => {
      callback('delay callback invoked!');
    }, delay);
    return 'ServiceProvider.delayCallback result';
  },

  openDialog: function(options: any) {
    setTimeout(() => {
      options.onClosed();
    }, 1000);
    return 'trigger option.onClosed after 1000ms';
  },

  promiseString: function(delay: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('String returned in promise');
      }, delay);
    });
  },

  promiseRejected: function(delay: number) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('Custom Error'));
      }, delay);
    });
  }
};
const childiframe = document.getElementById('childframe');
const provider = new Provider({
  providers: {
    ServiceProvider
  },
  targetWindow: (childiframe as HTMLIFrameElement).contentWindow as any
});

provider.start();