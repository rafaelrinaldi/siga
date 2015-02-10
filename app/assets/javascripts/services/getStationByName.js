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

  var stations = getStations();

  function getStationByName(name) {
    var station,
        search;

    $.each(stations, function(key, value) {
      station = value;
      search = sanitizeStationName(station.title);
      return !search.match(new RegExp(sanitizeStationName(name), 'gi'));
    });

    return station;
  }

  return getStationByName;

});
