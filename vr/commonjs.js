var module = {};
var exports = {};
var currentRelPath = '.';
var currentNodePath = '.';
var NPM_PATH = 'node_modules';

var require = (function () {

  function normalize(path) {
    var parts = path.split('/');
    var ret = [];
    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (part === '.' || part === '') {
        // no op!
      } else if (part === '..') {
        if (ret.length) {
          ret.pop();
        } else {
          ret.push(part);
        }
      } else {
        ret.push(part);
      }
    }
    return ret.join('/');
  }

  function base(path) {
    path = path.split('/');
    path.pop();
    return normalize(path.join('/'));
  }

  function join() {
    return Array.prototype.join.call(arguments, '/');
  }

  function getJSON(url) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, false);
    xhr.send();

    if (xhr.status === 200) {
      return JSON.parse(xhr.responseText);
    }
    throw new Error('404: ' + url);
  }

  function getMainPath(mod) {
    var pkg = getJSON(join(NPM_PATH, mod, 'package.json'));
    var main;
    if ('main' in pkg) {
      main =  pkg.main;
    } else {
      main = 'index.js';
    }
    return main;
  }

  function require(path) {
    var returnValue;
    // save the state of the current module;
    var oldModule = module;
    var oldExports = exports;
    var oldRelPath = currentRelPath;
    var oldNodePath = currentNodePath;

    if (path.indexOf('/') !== -1) {
      path = normalize(join(currentRelPath, path));
      currentRelPath = base(path);
      if (!path.endsWith('.js')) {
        path = path + '.js';
      }
    } else {
      var main = getMainPath(path);
      currentNodePath = join(currentNodePath, NPM_PATH, path);
      path = normalize(join(currentNodePath, main));
      currentRelPath = base(path);
    }

    module = {};
    exports = {};

    importScripts.call(this, path);

    // did the module define the exports object?
    if ('exports' in module) {
      returnValue = module.exports;
    } else {
      returnValue = exports;
    }

    // restore the state of the previous module;
    module = oldModule;
    exports = oldExports;
    currentRelPath = oldRelPath;
    currentNodePath = oldNodePath;

    return returnValue;
  }

  return require;
})();
