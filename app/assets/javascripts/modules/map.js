define(
[
  'jquery',
  'signals',
  'lib/gmaps',
  'mout/object/mixIn',
  'mout/lang/clone',
  'helpers/toLatLng',
  'config'
], function(
  $,
  Signal,
  gmaps,
  mixIn,
  clone,
  toLatLng,
  config
) {

  var p = Map.prototype;

  function Map(container, options) {
    this.container = container;
    this.options = options;
    this.markers = [];
    this.on = {
      loaded: new Signal(),
      markerClick: new Signal(),
      infoWindowClick: new Signal()
    };
  }

  p.initialize = function() {
    // NOTE: Changed from `clone()` in `defaultMapOptions` to passing an empty object first
    this.options = mixIn(
                    clone(config.defaultMapOptions),
                    this.options || {}
                  );

    if(!this.options || !this.options.center) {
      this.options.center = toLatLng(config.defaultCoordinates);
    }

    console.log('Map :: initialize() :: New map instance at "%s"', this.container);
    console.dir(this.options);

    this._setupMap();
    this._setupInfoWindow();
  };

  p._setupMap = function() {
    var self = this;

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
      // Remove the "x" icon added by default by Google Maps to the info window
      $('.gm-style-iw').next('div').remove();

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

    this.map.setOptions(
      mixIn(this.options, newOptions)
    );
  };

  p.setMarker = function(options, shouldCache) {
    var self = this,
        marker = new gmaps.Marker(
          mixIn({}, {map: this.map}, options)
        );

    if(options.content && options.content.length) {
      gmaps.event.addListener(marker, 'click', function() {
        self.infoWindow.setContent(self.formatInfoWindowContent(options));
        self.infoWindow.open(self.map, marker);
      });
    }

    gmaps.event.addListener(marker, 'click', $.proxy(this._markerClick, this));

    if(shouldCache) {
      this.markers.push(marker);
    }

    return marker;
  };

  p.getMarkerByCoordinates = function(coordinates) {
    var match;

    coordinates = coordinates.toString();

    match = $.grep(this.markers, function(marker) {
      return marker.position.toString() == coordinates;
    });

    return match[0];
  };

  /**
   * Get the nearest marker from a given coordinate (geocode location).
   * Uses the Haversine formula to figure things out: http://www.movable-type.co.uk/scripts/latlong.html
   * @param {Object} coordinates Expect "latitude" and "longitude" to be defined.
   * @return {Marker} Marker instance.
   */
  p.getNearestMarker = function(coordinates) {
    var markerLatitude,
        markerLongitude,
        // "d" is a Haversine variable to indicate a distance between two points
        dLatitude,
        dLongitude,
        // Haversine variables
        a,
        c,
        d,
        // Helper to convert a value to radians
        toRadians = function(value) { return value * Math.PI / 180; },
        // Coordinates
        latitude = coordinates.latitude || 0,
        longitude = coordinates.longitude || 0,
        // Coordinates in radians
        latitudeInRadians = toRadians(latitude),
        longitudeInRadians = toRadians(longitude),
        // Radius of Earth in KM
        R = 6371,
        distances = [],
        closest = -1,
        totalMarkers = this.markers.length,
        index = 0;

      for(; index < totalMarkers; ++index) {
        markerLatitude = this.markers[index].position.lat();
        markerLongitude = this.markers[index].position.lng();
        dLatitude = toRadians(markerLatitude - latitude);
        dLongitude = toRadians(markerLongitude - longitude);

        a = Math.sin(dLatitude * .5) *
            Math.sin(dLatitude * .5) +
            Math.cos(latitudeInRadians) *
            Math.cos(latitudeInRadians) *
            Math.sin(dLongitude * .5) *
            Math.sin(dLongitude * .5);

        c = 2 * Math.atan2(
                  Math.sqrt(a),
                  Math.sqrt(1 - a)
                );

        d = R * c;

        distances[index] = d;

        if(closest === -1 || d < distances[closest]) {
          closest = index;
        }
      }

    return this.markers[closest];
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

  // TODO: This should be declared outside of this context
  p.formatInfoWindowContent = function(options) {
    return '<div class="js-info-window info-window" data-station-id="' + options.id + '" style="font-size: 20px;">' +
              '<strong class="label">' + options.content + '</strong>' +
              '<i class="icon ion-ios7-information-outline"></i>' +
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

    this.on.infoWindowClick.dispatch(event, stationId);
  };

  p._markerClick = function(event) {
    var marker = this.getMarkerByCoordinates(event.latLng);
    this.setActiveMarker(marker);
  };

  p.setActiveMarker = function(marker, shouldPanMap) {
    if(!marker) {
      console.warn('Map :: setActiveMarker() :: Invalid marker');
      return;
    }

    console.log('Map :: setActiveMarker()', marker);

    if(this.activeMarker) {
      this.activeMarker.setTitle('');
    }

    marker.setTitle('is-active');

    if(shouldPanMap) {
      this.panTo(marker.position);
    }

    this.activeMarker = marker;
  };

  p.dispose = function() {
    this.on.loaded.removeAll();
    this.on.infoWindowClick.removeAll();
    this.on.markerClick.removeAll();

    this.markers.length = 0;
    this.markers = null;

    if(this.map) {
      gmaps.event.removeListener(this.map, 'tilesloaded');
      gmaps.event.removeListener(this.map, 'click');
    }
  };

  return Map;

});
