define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'mout/object/mixIn',
  'config',
  'services/getUserLocation',
  'services/getStations',
  'services/getStationByName',
  'services/getLine',
  'services/getLines',
  'services/getLineStations',
  'modules/map',
  'helpers/toLatLng',
  'text!partials/sections/overview.html'
], function(
  $,
  Vue,
  gmaps,
  mixIn,
  config,
  getUserLocation,
  getStations,
  getStationByName,
  getLine,
  getLines,
  getLineStations,
  Map,
  toLatLng,
  template
) {

  return Vue.extend({
    template: template,

    replace: true,

    attached: function() {
      this.initialize();
    },

    methods: {
      initialize: function() {
        this.$dispatch('app:sectionReady', this);
        this.setupMap();
      },

      dispose: function() {
        console.log('overview :: dispose()');

        if(this.overviewMap) {
          this.overviewMap.dispose();
          this.overviewMap = null;
        }
      },

      setupMap: function() {
        this.overviewMap = new Map('#overview-map');
        this.overviewMap.initialize();
        // Request user location when map is loaded
        this.overviewMap.on.loaded.addOnce(this.requestUserLocation, this);
        this.overviewMap.on.markerClick.add(this.markerClick, this);
      },

      requestUserLocation: function() {
        var self = this;

        getUserLocation()
          .then(function(response) {
            console.log('overview :: requestUserLocation() :: Got user location');
            return toLatLng(response);
          })
          .catch(function(warn) {
            console.warn('overview :: requestUserLocation() ::', warn);
            return self.overviewMap.getCenter();
          })
          .done(function(position) {
            self.userLocation = position;
            self.setUserLocationMarker(position);
            self.placeStationMarkers();
            self.saveUserNearestStation(position);
          });
      },

      setUserLocationMarker: function(position) {
        console.log('overview :: setUserLocationMarker ::', position);

        this.userLocationMarker = this.overviewMap.setMarker({
          position: position,
          animation: gmaps.Animation.BOUNCE
        });
      },

      saveUserNearestStation: function(position) {
        var coordinates = {
              latitude: position.lat(),
              longitude: position.lng()
            },
            // User nearest station marker
            userNearestStation = this.overviewMap.getNearestMarker(coordinates),
            userNearestStationName = userNearestStation.content,
            userNearestStationModel = getStationByName(userNearestStationName);

        console.log('overview :: saveUserNearestStation() :: Saving the model of user\'s nearest station');
        console.dir(userNearestStationModel);

        this.$root.nearestStation = userNearestStationModel;
      },

      moveToCenter: function() {
        this.overviewMap.panTo(this.userLocation);
      },

      markerClick: function(id) {
        this.$dispatch('app:setView', 'station', {id: id});
      },

      /**
       * Draw subway line on the map
       * @param {Array} stations List of subway station coordinates
       */
      placeLine: function(stations) {
        console.log('overview :: placeLine()');

        new gmaps.Polyline(mixIn(config.polyLine, {
          path: stations,
          strokeColor: color,
          map: this.overviewMap.getMap()
        }));
      },

      placeStationMarkers: function() {
        var lines = getLines(),
            firstStation,
            lastStation,
            position,
            path,
            points = [],
            allPoints = [],
            map = this.overviewMap,
            lineModel = {},
            lineStations = {},
            stations,
            self = this;

        console.log('overview :: placeStationMarkers() :: Rendering subway stations and lines');

        $.each(lines, function(index, line) {

          lineModel = getLine(line);
          stations = getLineStations(line);
          points = [];

          $.each(stations, function(index, station) {

            position = toLatLng(station.location);
            color = lineModel.color;

            // TODO: add a check to only print a marker if there's no marker for that coords
            map.setMarker({
              position: position,
              content: station.title,
              id: station.id,
              // TODO: Move icon options to config file
              // TODO: Change icon symbol
              icon: {
                path: gmaps.SymbolPath.CIRCLE,
                scale: 2,
                strokeColor: color,
                strokeWeight: 12
              }
            }, true);

            points.push(position);

          });

          self.placeLine(points);

        });

      }
    }
  });

});
