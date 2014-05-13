define(
[
  'jquery',
  'signals',
  'lib/gmaps',
  'mout/object/mixIn',
  'helpers/toLatLng',
  'config'
], function(
  $,
  Signal,
  gmaps,
  mixIn,
  toLatLng,
  config
) {

  var p = Map.prototype;

  function Map(container, options) {
    this.container = container;
    this.options = options;
    this.on = {
      loaded: new Signal()
    };
  }

  p.initialize = function() {
    this.options = mixIn(config.defaultMapOptions, this.options);

    if(!this.options || !this.options.center) {
      this.options.center = toLatLng(config.defaultCoordinates);
    }

    this._setupMap();
    this._setupInfoWindow();
  };

  p._setupMap = function() {
    var self = this;

    console.log('Map :: initialize() :: Creating a new map at "%s"', this.container, this.options);

    this.map = new gmaps.Map($(this.container).get(0), this.options);
    this.map.addListener('tilesloaded', $.proxy(this.notifyTilesLoaded, this));

    gmaps.event.addListener(this.map, 'click', function() {
      self.infoWindow.close();
    });
  };

  p._setupInfoWindow = function() {
    var options = config.infoWindow;

    this.infoWindow = new gmaps.InfoWindow({
      size: new gmaps.Size(options.width, options.height)
    });
  };

  p.setOptions = function(newOptions) {
    if(!this.map) {
      console.warn('Map :: setOptions() :: No map instance was created yet');
      return;
    }

    this.map.setOptions(mixIn(this.options, newOptions));
  };

  p.setMarker = function(options) {
    var self = this,
        marker = new gmaps.Marker(
          mixIn({map: this.map}, options)
        );

    gmaps.event.addListener(marker, 'click', function() {
      self.infoWindow.setContent('test');
      self.infoWindow.open(self.map, marker);
    });

    // gmaps.event.trigger(marker, 'click');

    return marker;
  };

  p.getMap = function() {
    return this.map;
  };

  p.getCenter = function() {
    return this.map.getCenter();
  };

  p.notifyTilesLoaded = function() {
    this.on.loaded.dispatch();
  };

  return Map;

});
