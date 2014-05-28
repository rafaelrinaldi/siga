define(
[
  'jquery',
  'vue',
  'config',
  'mout/object/mixIn',
  'mout/array/contains',
  'mout/lang/isEmpty',
  'modules/map',
  'lib/gmaps',
  'services/getStationByName',
  'services/getDestination',
  'services/getLine',
  'helpers/toLatLng',
  'text!partials/sections/directions/detail.html'
], function(
  $,
  Vue,
  config,
  mixIn,
  contains,
  isEmpty,
  Map,
  gmaps,
  getStationByName,
  getDestination,
  getLine,
  toLatLng,
  template
) {

  return Vue.extend({
    template: template,

    replace: true,

    data: {
      subwayRoutes: []
    },

    attached: function() {
      this.initialize();
    },

    filters: {
      shortDuration: function(value) {
        return value
                .replace(/minutos/gim, 'min')
                .replace(/segundos/gim, 'seg')
                .replace(/horas/gim, 'hr');
      },

      addZero: function(value) {
        value = parseInt(value, 10);
        if(value < 10) { value = '0' + value; }
        return value;
      },

      addParenthesis: function(value) {
        return '(' + value + ')';
      }
    },

    computed: {
      zeroRoutes: function() {
        return isEmpty(this.subwayRoutes);
      }
    },

    methods: {
      initialize: function() {
        var self = this;

        this.$dispatch('app:sectionReady', this);

        this.origin = getStationByName(this.$options.origin);
        this.destination = getStationByName(this.$options.destination);

        this.$root.$broadcast('header:setTitle', 'Direção');
        this.$root.$broadcast('header:setControls', [
          {klass: 'ion-ios7-arrow-back'},
          {klass: 'ion-navicon'}
        ]);
        this.$root.$broadcast('header:show');
        this.$root.$broadcast('footer:hide');
        this.$watch('subwayRoutes', function(routes) {
          if(!isEmpty(routes)) {
            $('#js-no-routes').hide();
          } else {
            $('#js-no-routes').show();
          }
        });

        this.setupMap();
        this.requestDestination();
      },

      setupMap: function() {
        var location = toLatLng(this.origin.location);

        this.detailMap = new Map('#directions-detail-map', {
          center: location,
          zoom: 13
        });
        this.detailMap.initialize();
        this.detailMap.on.loaded.addOnce(this.setMarkers, this);
      },

      onClick: function(model) {
        console.log('onClick');
        console.log(model.guide);
      },

      setMarkers: function() {
        var self = this,
            map = this.detailMap.getMap(),
            origin = toLatLng(this.origin.location),
            destination = toLatLng(this.destination.location),
            marker,
            bounds = new gmaps.LatLngBounds(),
            points = [],
            listener;

        $.map([origin, destination], function(point) {
          marker = self.detailMap.setMarker({
                    position: point,
                    optimized: false,
                    animation: gmaps.Animation.DROP
                  });

          points.push(point);
          bounds.extend(marker.position);
        });

        map.fitBounds(bounds);

        listener = gmaps.event.addListener(map, 'idle', function () {
            map.setZoom(13);
            gmaps.event.removeListener(listener);
        });

        this.placeLine(map, points);
      },

      placeLine: function(map, points) {
        new gmaps.Polyline(mixIn({}, config.polyLine, {
          path: points,
          strokeColor: '#4a87ee',
          map: map
        }));
      },

      requestDestination: function() {
        var origin = toLatLng(this.origin.location),
            destination = toLatLng(this.destination.location);

        getDestination(origin, destination)
          .then($.proxy(this.filterValidRoutes, this))
          .then($.proxy(this.placeValidRoutes, this));
      },

      filterValidRoutes: function(model) {
        var isValidRoute,
            routes = [];

        $.each(model.routes, function(routeIndex, route) {
          // console.log('\n\n');
          $.each(route.legs, function(legIndex, leg) {
            $.each(leg.steps, function(stepIndex, step) {
              isValidRoute = false;

              // If doesn't have transit information but travel mode is walking, it's a valid route.
              if(!step.transit && step.travel_mode === 'WALKING') {
                isValidRoute = true;
              // Otherwise, if travel mode is transit and vehicle type is subway, it's also a valid route.
              } else if(step.travel_mode === 'TRANSIT' && step.transit.line.vehicle.type === 'SUBWAY') {
                isValidRoute = true;
              }

              // console.log(step.instructions, isValidRoute);

              return isValidRoute;
            });
          });

          if(isValidRoute) {
            routes.push(route);
          }
          // console.log('is valid route?', isValidRoute);
        });

        return routes;
      },

      placeValidRoutes: function(routes) {
        var self = this,
            filtered = {},
            subwayStations = [],
            guide = [],
            subwayStationName,
            subwayStation,
            hasLineColor,
            isSubwayStation;

        $.each(routes, function(routeIndex, route) {

          subwayStations = [];
          guide = [];

          $.each(route.legs, function(legIndex, leg) {
            filtered[routeIndex] = {
              origin: self.origin.title,
              destination: self.destination.title,
              duration: leg.duration.text,
              distance: leg.distance.text
            };

            $.each(leg.steps, function(stepIndex, step) {

              hasLineColor = false;
              isSubwayStation = /^metrô/i.test(step.instructions);

              if(isSubwayStation) {
                subwayStationName = step.transit.headsign;
                subwayStation = getStationByName(subwayStationName);

                if(!hasLineColor) {
                  hasLineColor = true;
                  subwayStation.lineColor = getLine(subwayStation.lines[0].id).color;
                }

                subwayStations.push(subwayStation);
              }

              guide.push(step.instructions);

            });
          });

          filtered[routeIndex].steps = subwayStations;
          filtered[routeIndex].guide = guide;
        });

        this.subwayRoutes = filtered;
      }
    }
  });

});
