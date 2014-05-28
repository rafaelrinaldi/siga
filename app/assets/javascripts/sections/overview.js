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

    attached: function() {
      this.initialize();
    },

    methods: {
      initialize: function() {
        this.$dispatch('app:sectionReady', this);

        this.$root.$broadcast('header:setTitle', 'Mapa');
        this.$root.$broadcast('header:show');
        this.$root.$broadcast('footer:hide');
        this.$root.$broadcast('header:setControls', [
          {
            channel: 'navigation:toggleNavigation',
            klass: 'ion-navicon'
          },
          {
            channel: 'navigation:nearestStation',
            klass: 'ion-ios7-navigate-outline'
          }
        ]);

        this.$root.$on('navigation:nearestStation', $.proxy(this.nearestStation, this));

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
        this.overviewMap.on.infoWindowClick.add(this.infoWindowClick, this);
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
            self.nearestStation();
            self.$dispatch('app:sectionLoaded');
          });
      },

      setUserLocationMarker: function(position) {
        console.log('overview :: setUserLocationMarker ::', position);

        this.userLocationMarker = this.overviewMap.setMarker({
          position: position,
          optimized: false
        });
      },

      saveUserNearestStation: function(position) {
        var coordinates = {
              latitude: position.lat(),
              longitude: position.lng()
            },
            userNearestStationMarker = this.overviewMap.getNearestMarker(coordinates),
            userNearestStationName = userNearestStationMarker.content,
            userNearestStationModel = getStationByName(userNearestStationName);

        console.log('overview :: saveUserNearestStation() :: Saving the model of user\'s nearest station');
        console.dir(userNearestStationModel);

        // User nearest station marker
        this.userNearestStationMarker = userNearestStationMarker;

        this.$root.nearestStation = userNearestStationModel;
      },

      moveToCenter: function() {
        this.overviewMap.panTo(this.userLocation);
      },

      nearestStation: function() {
        this.overviewMap.setActiveMarker(this.userNearestStationMarker, true);
      },

      infoWindowClick: function(event, id) {
        this.$dispatch('app:setView', 'station', {id: id});
      },

      /**
       * Draw subway line on the map
       * @param {Array} stations List of subway station coordinates
       */
      placeLine: function(stations) {
        console.log('overview :: placeLine()');

        new gmaps.Polyline(mixIn({}, config.polyLine, {
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
            marker,
            markers = {},
            hasMarkerAlready = false,
            path,
            points = [],
            allPoints = [],
            map = this.overviewMap,
            lineModel = {},
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
            marker = position.toString();

            // Check if there's already a marker for that specific location
            hasMarkerAlready = markers[marker];

            // If it doesn't, create a marker for that position
            if(!hasMarkerAlready) {
              markers[marker] = true;

              map.setMarker({
                visible: true,
                position: position,
                content: station.title,
                id: station.id,
                icon: mixIn(
                  {},
                  config.stationMarker,
                  {strokeColor: color}
                )
              }, true);
            }

            points.push(position);

          });

          self.placeLine(points);

        });

      }
    }
  });

});
