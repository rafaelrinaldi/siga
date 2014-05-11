define(
  [
    'exports',
    'signals',
    'crossroads',
    'hasher'
  ],
  function(
    exports,
    Signal,
    crossroads,
    hasher
  ) {
    exports.on = {
      matchRoute: new Signal()
    };

    exports.initialize = function() {
     crossroads.addRoute('/', _matchRoute);
     crossroads.addRoute('/{section}', _matchRoute);

     crossroads.routed.add(console.log, console);

     hasher.prependHash = '!';
     hasher.initialized.add(_parseHash);
     hasher.changed.add(_parseHash);
     hasher.init();
    };

    function _matchRoute(section) {
      exports.on.matchRoute.dispatch(section);
    }

    function _parseHash(newHash, oldHash) {
      crossroads.parse(newHash);
    }
  }
);
