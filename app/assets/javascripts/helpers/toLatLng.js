define(
[
  'lib/gmaps'
], function(
  gmaps
) {

  'use strict';

  /**
   * Converts a coordinates object to `gmaps.LatLng` format.
   * @param  {Object} coordinates       Coordinates model
   * @return {gmaps.LatLng}             Google Maps coordinates object
   */

  function toLatLng(coordinates) {
    return new gmaps.LatLng(coordinates.latitude, coordinates.longitude);
  }

  return toLatLng;

});
