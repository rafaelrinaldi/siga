define(
[
  'text!stations.json'
], function(
  stations
) {

  function getStations() {
    return JSON.parse(stations);
  }

  return getStations;

});
