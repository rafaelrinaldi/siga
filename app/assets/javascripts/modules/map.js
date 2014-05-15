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
      loaded: new Signal(),
      markerClick: new Signal()
    };
  }

  p.initialize = function() {
    this.options = mixIn(config.defaultMapOptions, this.options || {});

    if(!this.options || !this.options.center) {
      this.options.center = toLatLng(config.defaultCoordinates);
    }

    this._setupMap();
    this._setupInfoWindow();
  };

  p._setupMap = function() {
    var self = this;

    console.log('Map :: initialize() :: Creating a new map at "%s"', this.container);
    console.dir(this.options);

    this.map = new gmaps.Map($(this.container).get(0), this.options);
    this.map.addListener('tilesloaded', $.proxy(this.notifyTilesLoaded, this));

    gmaps.event.addListener(this.map, 'click', function() {
      self.infoWindow.close();
    });
  };

  p._setupInfoWindow = function() {
    var self = this,
        options = config.infoWindow;

    this.infoWindow = new gmaps.InfoWindow({
      size: new gmaps.Size(options.width, options.height)
    });

    // Waits for the window to be fully attached to the DOM before watching for a click on it
    gmaps.event.addListener(this.infoWindow, 'domready', function(event) {
      $('.js-info-window').one('click', $.proxy(self._infoWindowClick, self));
    });
  };

  p.panTo = function(position) {
    switch(position) {
      case 'center' :
        position = this.map.getCenter();
      break;
    }

    console.log('Map :: panTo() :: Moving map to', position);

    this.map.panTo(position);
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

    if(options.content && options.content.length) {
      gmaps.event.addListener(marker, 'click', function() {
        self.infoWindow.setContent(self.formatInfoWindowContent(options));
        self.infoWindow.open(self.map, marker);
      });
    }

    return marker;
  };

  p.setAreaRange = function(options) {
    var areaRange = new gmaps.Circle(
      mixIn(
        config.areaRange,
        {map: this.map, center: this.location},
        options
      )
    );

    areaRange.bindTo('center', options.marker, 'position');

    return areaRange;
  };

  // TODO: This should be declared in the parent element
  p.formatInfoWindowContent = function(options) {
    return  '<div class="js-info-window info-window" data-station-id="' + options.id + '">' +
              '<strong>' + options.content + '</strong>' +
              '<button>+</button>' +
            '</div>';
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

  // TODO: Should call station detail
  // TODO: Should be generic (defined outside of this scope)
  p._infoWindowClick = function(event) {
    var target = $(event.target).parent(),
        stationId = target.data('station-id');

    if(this.infoWindow) {
      this.infoWindow.close();
    }

    this.on.markerClick.dispatch(stationId);
  };

  return Map;

});
