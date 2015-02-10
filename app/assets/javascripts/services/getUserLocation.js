define(
[
  'q'
], function(
  Q
) {

  'use strict';

  function getUserLocation() {
    var deferred = Q.defer();

    if(!navigator.geolocation) {
      deferred.reject(new Error('Browser doesn\'t support geolocation feature, using fallback coordinates'));
    }

    navigator.geolocation.getCurrentPosition(
      function(position) {
        deferred.resolve(position.coords);
      },

      function() {
        deferred.reject(new Error('User chose not to allow geolocation feature, using fallback coordinates'));
      }
    );

    return deferred.promise;
  }

  return getUserLocation;

});
