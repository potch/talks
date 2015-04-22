function PromiseWorker(url) {
  var self = this;
  var w = new Worker('worker.js?' + url);

  var callId = 0;
  var promises = {};

  var api = {};

  function registerRPC(method) {
    api[method] = function() {
      var args = Array.prototype.slice.apply(arguments);
      var cId = ++callId;
      w.postMessage({
        type: 'rpc',
        method: method,
        args: args,
        callId: cId
      });
      return new Promise(function (resolve, reject) {
        promises[cId] = {
          resolve: resolve,
          reject: reject
        };
      });
    };
  }

  self.ready = new Promise(function (resolve, reject) {
    w.addEventListener('message', function (e) {
      var msg = e.data;
      if (msg && msg.type === 'rpcRegister' && msg.methods instanceof Array) {
        msg.methods.forEach(registerRPC);
        resolve(api);
      }
    });
  });

  w.addEventListener('message', function (e) {
    var msg = e.data;
    switch (msg.type) {
      case 'rpcResponse':
        var p = promises[msg.callId];
        if (p) {
          p.resolve(msg.response);
        }
        break;
    }
  });
}

var w = new PromiseWorker('js/main.js');
w.ready.then(function (api) {

  (function () {
    var input = document.querySelector('.demo1 .input');
    var output = document.querySelector('.demo1 .output');

    input.addEventListener('keydown', function (e) {
      e.stopPropagation();
      setTimeout(function () {
        api.markdown(input.value).then(function (html) {
          output.innerHTML = html;
        });
      }, 0);
    });
  })();

});
