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
          .then($.proxy(this.testRoutes, this));
      },

      parseRoutes: function(model) {
        var steps = this.parseRoutesSteps(model.routes);

        this.routes = model.routes;
        this.steps = steps;

        console.log(steps);
      },

      testRoutes: function(model) {
        var routes = model.routes;
        console.log(routes);
        return;

        routes.forEach(function(route) {
          route.legs.forEach(function(leg) {
            vehicleTypes = [];
            leg.steps.forEach(function(step) {
              hasTransitDetails = step.transit;
              if(hasTransitDetails) {
                vehicleType = step.transit.line.vehicle.type;
                // check if vehicle type is subway, otherwise doesn't use its data
                // TODO: need to loop through vehicle tipes using `$.grep` to check if any
                // occurrency has anything other than SUBWAY, doesn't matter the order.
                hasValidVehicleType = vehicleType === 'SUBWAY';
                if(hasValidVehicleType) {
                  if(callback) {
                    callback(index, route, leg, step);
                  }
                }
              }
            });
          });
          ++index;
        });
      },

      parseRoutesSteps: function(routes) {
        var model,
            steps = [],
            LINE_ID_REGEX = /\s(.*)/i,
            formatLineName = function(name) {
              return name.match(LINE_ID_REGEX)[0].toLowerCase().trim();
            };

        this.iterateThroughSubwayRoutes(routes, function(index, route, leg, step) {
          // Create step array if it doesn't exist yet
          if(!steps[index]) {
            steps[index] = [];
          }

          // Compose step model
          model = {
            line: {
              name: formatLineName(step.transit.line.short_name),
              color: step.transit.line.color,
              textColor: step.transit.line.text_color
            },
            departure: step.transit.departure_stop.name,
            arrival: step.transit.arrival_stop.name
          }

          // Update steps list
          steps[index].push(model);
        });

        return steps;
      },

      iterateThroughSubwayRoutes: function(routes, callback) {
        var index,
            hasInnerSteps,
            hasTransitDetails,
            hasValidVehicleType,
            vehicleType;

        index = 0;

        routes.forEach(function(route) {
          route.legs.forEach(function(leg) {
            vehicleTypes = [];
            leg.steps.forEach(function(step) {
              hasTransitDetails = step.transit;
              if(hasTransitDetails) {
                vehicleType = step.transit.line.vehicle.type;
                // check if vehicle type is subway, otherwise doesn't use its data
                // TODO: need to loop through vehicle tipes using `$.grep` to check if any
                // occurrency has anything other than SUBWAY, doesn't matter the order.
                hasValidVehicleType = vehicleType === 'SUBWAY';
                if(hasValidVehicleType) {
                  if(callback) {
                    callback(index, route, leg, step);
                  }
                }
              }
            });
          });
          ++index;
        });
      }
    }
  });

});
