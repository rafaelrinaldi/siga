define(
[
  'services/getStations'
], function(
  getStations
) {

  var stations = getStations();

  function getStationById(id) {
    return stations[id];
  }

  return getStationById;

});
