define(
[
  'jquery',
  'mout/object/mixIn',
  'lib/gmaps',
  'helpers/toLatLng',
  'config',
], function(
  $,
  mixIn,
  gmaps,
  toLatLng,
  config
) {

  var p = Map.prototype;

  function Map(container, options) {
    this.container = container;
    this.options = options;
  }

  p.initialize = function() {
    this.options = mixIn(config.defaultMapOptions, this.options);

    if(!this.options || !this.options.center) {
      this.options.center = toLatLng(config.defaultCoordinates);
    }

    console.log('Map :: initialize() :: Creating a new map at "%s"', this.container, this.options);

    this.map = new gmaps.Map($(this.container).get(0), this.options);
  };

  p.setOptions = function(newOptions) {
    if(!this.map) {
      console.warn('Map :: setOptions() :: No map instance was created yet');
      return;
    }

    this.map.setOptions(mixIn(this.options, newOptions));
  };

  return Map;

});
