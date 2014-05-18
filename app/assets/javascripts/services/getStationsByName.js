define(
[
  'jquery',
  'mout/object/pluck',
  'mout/object/values',
  'helpers/sanitizeStationName',
  'services/getStations'
], function(
  $,
  pluck,
  values,
  sanitizeStationName,
  getStations
) {
  var stations;

  // Shout out to mout
  stations = getStations();
  stations = pluck(stations, 'title');
  stations = values(stations);

  function getStationsByName(name) {
    var matches = [];

    name = sanitizeStationName(name);

    matches = $.grep(stations, function(station) {
      return new RegExp(name, 'gi')
              .test(
                sanitizeStationName(station)
              );
    });

    return matches;
  }

  return getStationsByName;

});
