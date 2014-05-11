define(
  [
    'exports',
    'q',
    'lib/gmaps',
    'mout/object/mixIn'
  ],
  function(
    exports,
    Q,
    gmaps,
    mixIn
  ) {
    var directions = new gmaps.DirectionsService(),
        request = {
          travelMode: gmaps.DirectionsTravelMode.TRANSIT,
          provideRouteAlternatives: true
        };

    function getDestination(origin, destination) {
      var deferred = Q.defer();

      request = mixIn(request, {origin: origin, destination: destination});
      console.log(request);

      directions.route(request, function(result, status) {
        if(status === google.maps.DirectionsStatus.OK) {
          deferred.resolve(result, status);
        } else {
          deferred.reject(result, status);
        }
      });

      return deferred.promise;
    }

    return getDestination;
  }
);
