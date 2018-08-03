import { Client, Callback } from '../src/index';
const client = new Client({
  targetWindow: window.parent
});
client.start();

/**
 * Test 1
 */
const button1 = document.getElementById('test1');
// tslint:disable-next-line:no-unused-expression
button1 && button1.addEventListener('click', function(){
  const result = client.invoke('ServiceProvider', 'print', ['test text']);
  result.then((returnedText) => {
    alert(`RPC result: ${returnedText}`);
  });
}, false);


/**
 * Test 2
 */
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

/**
 * Test 3
 */
const button3 = document.getElementById('test3');
// tslint:disable-next-line:no-unused-expression
button3 && button3.addEventListener('click', function(){
  const result = client.invoke('ServiceProvider', 'openDialog', [{
    onClosed: Callback(function() {
      alert('onClosed invoked');
    })
  }]);
  result.then((returnedText) => {
    alert(returnedText);
  });
}, false);