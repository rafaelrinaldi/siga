define(
[
  'jquery',
  'mout/string/replaceAccents',
  'services/getStations'
], function(
  $,
  replaceAccents,
  getStations
) {

  var stations = getStations();

  function getStationByName(name) {
    var station,
        search;

    $.each(stations, function(key, value) {
      station = value;
      search = replaceAccents(station.title);
      return !search.match(new RegExp(replaceAccents(name), 'i'));
    });

    return station;
  }

  return getStationByName;

});
