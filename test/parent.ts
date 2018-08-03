import { Provider } from '../lib/index';
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

  // TODO:
  // printGeneratedString: function(generator: () => string){
  //   alert(generator());
  // }
};
const childiframe = document.getElementById('childframe');
const provider = new Provider({
  providers: {
    ServiceProvider
  },
  targetWindow: (childiframe as HTMLIFrameElement).contentWindow as any
});

provider.start();