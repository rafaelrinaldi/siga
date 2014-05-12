define(
[
  'jquery',
  'services/getStations'
], function(
  $,
  getStations
) {

  var stations = getStations();

  function getLineStations(lineId) {
    var lineStations = [];

    $.each(stations, function(stationId, station) {
      $.each(station.lines, function(lineIndex, line) {
        if(line.id === lineId) {
          lineStations[line.stop] = station;
        }
      });
    });

    return lineStations;
  }

  return getLineStations;

});
