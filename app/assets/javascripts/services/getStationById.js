define(
[
  'jquery',
  'mout/object/mixIn',
  'services/getLine',
  'services/getStations'
], function(
  $,
  mixIn,
  getLine,
  getStations
) {

  'use strict';

  var stations = getStations();

  function getStationById(id) {
    var station = stations[id];

    // Mix in line id and stop with title and color properties
    $.each(station.lines, function(index, line) {
      line = mixIn(
        line,
        getLine(line.id)
      );
    });

    return station;
  }

  return getStationById;

});
