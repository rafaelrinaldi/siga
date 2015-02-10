define(
[
  'jquery',
  'helpers/sanitizeStationName',
  'services/getStations'
], function(
  $,
  sanitizeStationName,
  getStations
) {

  'use strict';

  var stations;

  // Shout out to mout
  stations = getStations();

  function getStationsByName(name) {
    var matches = [],
        stationName,
        matchStationRegex,
        doesMatchStation,
        lines;

    name = sanitizeStationName(name);

    $.each(stations, function(stationIndex, station) {
      stationName = sanitizeStationName(station.title);
      matchStationRegex = new RegExp(name, 'gi');
      doesMatchStation = matchStationRegex.test(stationName);

      if(doesMatchStation) {
        matches.push(station);
      }
    });

    return matches;
  }

  return getStationsByName;

});
