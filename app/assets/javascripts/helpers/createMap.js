define(
[
  'jquery',
  'mout/object/mixIn',
  'lib/gmaps',
  'config',
  'helpers/toLatLng'
], function(
  $,
  mixIn,
  gmaps,
  config,
  toLatLng
) {

  function createMap(container, options) {
    options = mixIn(config.defaultMapOptions, options);

    if(!options || !options.center) {
      options.center = toLatLng(config.defaultCoordinates);
    }

    console.log('createMap() :: Creating a new map at "%s"', container, options);

    return new gmaps.Map($(container).get(0), options);
  }

  return createMap;

});
