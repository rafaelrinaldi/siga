define(
[
  'jquery',
  'mout/array/contains',
  './getStations'
], function(
  $,
  contains,
  getStations
) {

  function getLines() {
    var stations = getStations(),
        lines = [];

    $.each(stations, function(id, station) {
      $.each(station.lines, function(index, line) {
        if(!contains(lines, line.id)) {
          lines.push(line.id);
        }
      });
    });

    return lines;
  }

  return getLines;

});
