define(
[
  'exports',
  'data/stations'
], function(
  exports,
  stations
) {

  'use strict';

  function getStations() { return stations; }

  return getStations;

});
