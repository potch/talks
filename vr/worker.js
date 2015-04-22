importScripts('../commonjs.js');

var script = location.search.substring(1);

var api = require(script);

var methods = Object.keys(api);

postMessage({
  type: 'rpcRegister',
  methods: methods
});

// console.log(location.search);

addEventListener('message', function (e) {
  var msg = e.data;
  if (msg.type === 'rpc') {
    var method = msg.method;
    var args = msg.args;
    var callId = msg.callId;
    if (method in api) {
      var result = api[method].apply(this, args);
      if (result instanceof Promise) {
        result.then(function () {
          postMessage({
            type: 'rpcResponse',
            callId: callId,
            response: result
          });
        });
      } else {
        postMessage({
          type: 'rpcResponse',
          callId: callId,
          response: result
        });
      }
    }
  }
});
