import assert from 'assert';
import sinon from 'sinon';
// import 'mocha';
import Client from '../src/Client';
import Provider from '../src/Provider';
import { Callback } from '../src/util';

import ServiceProvider from './ServiceProvider';

const sandbox = sinon.createSandbox();

class StubWindow {
  _callbacks: {};

  constructor() {
    this._callbacks = {};
  }

  postMessage = (data, origin) => {
    const callbackKey = 'message';
    if (this._callbacks.hasOwnProperty(callbackKey)) {
      this._callbacks[callbackKey]({
        data
      });
    }
  };

  // only handle type='message'
  addEventListener = (type: string, callback: any, useCapture: boolean) => {
    // TODO: hash callback.toString & type as callbacks key
    this._callbacks[type] = callback;
  };

  removeEventListener = (type: string, callback: any, useCapture: boolean) => {
    this._callbacks[type] = null;
  }
}

describe('common test', function() {
  describe('all tests', function() {
    this.timeout(5000);
    let provider;
    let client;
    let parentWindow;
    let childWindow;
    before(function() {
      parentWindow = new StubWindow();
      childWindow = new StubWindow();
      provider = new Provider({
        providers: {
          'ServiceProvider': ServiceProvider
        },
        targetWindow: childWindow,
        currentWindow: parentWindow
      });
      provider.start();
      client = new Client({
        targetWindow: parentWindow,
        currentWindow: childWindow
      });
      client.start();
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('should call sync RPC method', function(done) {
      const spy = sandbox.spy(ServiceProvider, 'print');
      const result = client.invoke('ServiceProvider', 'print', ['test text']);
      try {
        result.then((returnedText) => {
          assert.equal(returnedText, 'ServiceProvider.print result');
          const call = spy.getCall(0);
          assert.equal(call.args[0], 'test text');
          done();
        }).catch((e) => {
          done(e);
        });
      } catch (e) {
        done(e);
      }
    });

    it('should call async RPC method with callback', function(done) {
      const fakeCallback = sandbox.fake();
      const result = client.invoke('ServiceProvider', 'delayCallback', [2000, Callback(fakeCallback)]);
      try {
        result.then((returnedText) => {
          assert.equal(returnedText, 'ServiceProvider.delayCallback result');
          assert.equal(fakeCallback.callCount, 0, 'callback should not be called immediately');
          setTimeout(() => {
            assert.equal(fakeCallback.callCount, 1);
            done();
          }, 2100);
        });
      } catch (e) {
        done(e);
      }
    });

    it('should call async RPC method with nested param', function(done) {
      const fakeCallback = sandbox.fake();
      const result = client.invoke('ServiceProvider', 'openDialog', [{
        onClosed: Callback(fakeCallback)
      }]);
      try {
        result.then((returnedText) => {
          assert.equal(returnedText, 'trigger option.onClosed after 1000ms');
          assert.equal(fakeCallback.callCount, 0, 'callback should not be called immediately');
          setTimeout(() => {
            assert.equal(fakeCallback.callCount, 1);
            done();
          }, 1100);
        });
      } catch (e) {
        done(e);
      }
    });

    it('should call RPC method return a Promise', function(done) {
      const fakeCallback = sandbox.fake();
      const result = client.invoke('ServiceProvider', 'promiseString', [1000]);
      try {
        result.then((returnedText) => {
          assert.equal(returnedText, 'String returned in promise');
          done();
        });
      } catch (e) {
        done(e);
      }
    });

    it('should call RPC method return a rejected Promise', function(done) {
      const fakeCallback = sandbox.fake();
      const result = client.invoke('ServiceProvider', 'promiseRejected', [1000]);
      try {
        result.then((returnedText) => {
        }).catch((e) => {
          assert.equal(e.message, 'Custom Error');
          done();
        });
      } catch (e) {
        done(e);
      }
    });

    it('should call async RPC method with undefined callback', function(done) {
      const result = client.invoke('ServiceProvider', 'delayCallback', [1000, Callback(undefined)]);
      try {
        result.then((returnedText) => {
          assert.equal(returnedText, 'ServiceProvider.delayCallback result');
          setTimeout(() => {
            done();
          }, 1500);
        });
      } catch (e) {
        done(e);
      }
    });
  });
});