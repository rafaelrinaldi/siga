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
      },

      parseGuide: function(value) {
        var isOrigin = /^\$origin/.test(value),
            isDestination = /^\$destination/.test(value),
            guide;

        if(isOrigin) {
          guide = 'Embarque na estação ' + value.replace('$origin', '');
        } else if(isDestination) {
          guide = 'Desembarque na estação ' + value.replace('$destination', '');
        } else {
          guide = value.replace(/ande para/im, 'Desembarque na ');
        }

        return guide;
      },

      parseIcon: function(value) {
        var icons = {
              '$origin': 'ion-ios7-arrow-thin-right',
              '$destination': 'ion-ios7-arrow-thin-left',
              'Ande': 'ion-fork-repo',
              'Metrô': 'ion-man'
            },
            keyword = value.split(' ').shift();
            icon = icons[keyword];

        return icon;
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

        this.mapContainer = $('#js-directions-map');
        this.routesContainer = $('#js-directions-routes');
        this.guideContainer = $('#js-directions-guide');

        this.origin = getStationByName(this.$options.origin);
        this.destination = getStationByName(this.$options.destination);

        this.$root.$broadcast('header:setTitle', 'Direção');
        this.$root.$broadcast('header:setControls', [
          {klass: 'ion-ios7-arrow-back', channel: 'header:detail:historyBack'},
          {}
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

        this.$root.$on('header:detail:historyBack', $.proxy(this.historyBack, this));
        this.$root.$on('header:detail:showGuide', $.proxy(this.showGuide, this));
        this.$root.$on('header:detail:hideGuide', $.proxy(this.hideGuide, this));

        this.setupMap();
        this.requestDestination();
      },

      setupMap: function() {
        var location = toLatLng(this.origin.location);

        this.detailMap = new Map('#directions-detail-map', {
          center: location,
          zoom: 12
        });
        this.detailMap.initialize();
        this.detailMap.on.loaded.addOnce(this.setMarkers, this);
      },

      showGuide: function() {
        this.$root.$broadcast('header:setControls', [
          {klass: 'ion-ios7-arrow-back', channel: 'header:detail:historyBack'},
          {klass: 'ion-ios7-arrow-down', channel: 'header:detail:hideGuide'}
        ]);

        this.routesContainer.addClass('is-hidden');
        this.mapContainer.addClass('is-hidden');
        this.guideContainer.addClass('is-expanded');
      },

      hideGuide: function() {
        this.$root.$broadcast('header:setControls', [
          {klass: 'ion-ios7-arrow-back', channel: 'header:detail:historyBack'},
          {}
        ]);

        this.routesContainer.removeClass('is-hidden');
        this.mapContainer.removeClass('is-hidden');
        this.guideContainer.removeClass('is-expanded');
      },

      historyBack: function() {
        this.$dispatch('app:setView', 'directions');
      },

      onClick: function(model) {
        var self = this;
        this.details = model;
        setTimeout($.proxy(self.showGuide, self), 100);
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
                    optimized: false
                  });

          points.push(point);
          bounds.extend(marker.position);
        });

        map.fitBounds(bounds);

        listener = gmaps.event.addListener(map, 'idle', function () {
            self.guideContainer.css({display: 'block'});
            map.setZoom(12);
            gmaps.event.removeListener(listener);
        });

        this.placeLine(map, points);

        this.$dispatch('app:sectionLoaded');
      },

      dispose: function() {
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

            guide.push('$origin ' + self.origin.title);

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

            guide.push('$destination ' + self.destination.title);
          });

          filtered[routeIndex].steps = subwayStations;
          filtered[routeIndex].guide = guide;
        });

        this.subwayRoutes = filtered;
      }
    }
  });

});
