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

    'use strict';

    /**
     * Simple client side router.
     */

    exports.on = {
      matchRoute: new Signal()
    };

    exports.initialize = function() {
     crossroads.addRoute('', _matchRoute);
     crossroads.addRoute('/{section}', _matchRoute);

     crossroads.routed.add(_notifyMatchedRoute);

     hasher.prependHash = '!';
     hasher.initialized.add(_parseHash);
     hasher.changed.add(_parseHash);
     hasher.init();
    };

    function _matchRoute(section) {
      exports.on.matchRoute.dispatch(section || 'index');
    }

    function _parseHash(newHash, oldHash) {
      crossroads.parse(newHash);
    }

    function _notifyMatchedRoute(route, model) {
      console.log('router :: _notifyMatchedRoute() ::', route || 'index', model);
    }
  }
);
