define(
[
  'jquery',
  'vue',
  'mout/array/contains',
  'modules/map',
  'services/getStationByName',
  'services/getDestination',
  'helpers/toLatLng',
  'text!partials/sections/directions/detail.html'
], function(
  $,
  Vue,
  contains,
  Map,
  getStationByName,
  getDestination,
  toLatLng,
  template
) {

  return Vue.extend({
    template: template,

    data: {},

    attached: function() {
      this.$dispatch('app:sectionReady', this);
      this.initialize();
    },

    methods: {
      initialize: function() {
        this.origin = getStationByName(this.$options.origin);
        this.destination = getStationByName(this.$options.destination);
        this.setupMap();
        this.requestDestination();
        this.$root.$broadcast('header:setTitle', 'Direção');
        this.$root.$broadcast('header:setControls', [
          {klass: 'ion-ios7-arrow-back'},
          {klass: 'ion-navicon'}
        ]);
        this.$root.$broadcast('header:show');
        this.$root.$broadcast('footer:hide');
      },

      setupMap: function() {
        var location = toLatLng(this.origin.location);

        this.detailMap = new Map('#directions-detail-map', {
          center: location
        });
        this.detailMap.initialize();
      },

      requestDestination: function() {
        var origin = toLatLng(this.origin.location),
            destination = toLatLng(this.destination.location);

        getDestination(origin, destination)
          .then($.proxy(this.filterValidRoutes, this))
          // .then($.proxy(this.parseSteps, this));
      },

      filterValidRoutes: function(model) {
        var isValidRoute,
            routes = [];

        $.each(model.routes, function(routeIndex, route) {
          console.log('\n\n');
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

              console.log(step.instructions, isValidRoute);

              return isValidRoute;
            });
          });

          if(isValidRoute) {
            routes.push(route);
          }
          console.log('is valid route?', isValidRoute);
        });

        return routes;
      },

      parseSteps: function(routes) {
        var steps = [],
            legModel = {},
            stepModel = {};
            console.log(routes);
            return

        $.each(routes, function(routeIndex, route) {
          console.log('\n');
          $.each(route.legs, function(legIndex, leg) {
            legModel = {
              departure: leg.departure_time.text,
              arrival: leg.arrival_time.text,
              duration: leg.duration.text,
              distance: leg.distance.text,
              totalStops: 0,
              steps: []
            };

            $.each(leg.steps, function(stepIndex, step) {
              console.log(step);
              stepModel = {
                type: 'walking',
                instructions: step.instructions
              };

              // if(step.transit && step.transit.line) {
              //   stepModel.type = 'subway';
              //   stepModel.direction = step.transit.headsign;
              //   stepModel.departure = step.transit.departure_stop.name;
              //   stepModel.arrival = step.transit.arrival_stop.name;
              //   stepModel.totalStops = parseInt(step.transit.num_stops, 10);

              //   legModel.totalStops += stepModel.totalStops;
              // }

              // legModel.steps.push(stepModel);

            });
          // console.log(legModel);
          // steps.push(legModel);
          });
        });
      }
    }
  });

});
