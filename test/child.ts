import { Client, Callback } from '../lib/index';
const client = new Client({
  targetWindow: window.parent
});
client.start();
const button1 = document.getElementById('test1');
// tslint:disable-next-line:no-unused-expression
button1 && button1.addEventListener('click', function(){
  const result = client.invoke('ServiceProvider', 'print', ['test text']);
  result.then((returnedText) => {
    alert(`RPC result: ${returnedText}`);
  });
}, false);
const button2 = document.getElementById('test2');
// tslint:disable-next-line:no-unused-expression
button2 && button2.addEventListener('click', function(){
  const result = client.invoke('ServiceProvider', 'delayCallback', [2000, Callback(function(){
    alert('delay callback invoked');
  })]);
  result.then((returnedText) => {
    alert(returnedText);
  });
}, false);