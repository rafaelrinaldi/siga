define(
[
  'lib/gmaps'
], function(
  gmaps
) {

  function toLatLng(coordinates) {
    return new gmaps.LatLng(coordinates.latitude, coordinates.longitude);
  }

  return toLatLng;

});
