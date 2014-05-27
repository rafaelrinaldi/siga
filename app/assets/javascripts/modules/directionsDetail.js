// TODO: this can be an inner component of directions instead of a global one
define(
  [
    'jquery',
    'vue',
    'lib/gmaps',
    'mout/string/replaceAccents',
    'services/getDestination',
    'data/stations',
    'text!partials/directions_detail.html'
  ],
  function(
    $,
    Vue,
    gmaps,
    replaceAccents,
    getDestination,
    stations,
    template
  ) {

    'use strict';

    return Vue.extend({
      template: template,

      data: {
        steps: [],
        routes: [],
        instructions: []
      },

      ready: function() {
        this.stations = stations;
        this.options = this.$root.currentViewOptions;
        this.parseCoordinates();
        this.parseDestination();
      },

      attached: function() {
        var buildMap = this.buildMap.bind(this);

        $(function() {
          buildMap();
        });
      },

      methods: {
        buildMap: function() {
          var location = this.options.origin.location;

          this.map = new gmaps.Map($('#map').get(0));
          this.map.setOptions({
            zoom: 16,
            center: new gmaps.LatLng(location.latitude, location.longitude),
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false
          });
        },

        setMarker: function(coordinates) {

        },

        setMarkers: function() {
        },

        getStationById: function(id) {
          return this.stations[id];
        },

        getStationByTitle: function(name) {
          var stations = this.stations,
              station,
              title;

          $.each(stations, function(key, value) {
            station = value;
            title = replaceAccents(station.title);
            return !title.match(new RegExp(replaceAccents(name), 'i'));
          });

          return station;
        },

        parseCoordinates: function() {
          this.options.origin = this.getStationByTitle(this.options.origin);
          this.options.destination = this.getStationByTitle(this.options.destination);
        },

        parseDestination: function() {
          getDestination(this.options.origin.location.address, this.options.destination.location.address)
            // TODO: maybe change from `bind` to `$.proxy`
            .then(this.parseRoutes.bind(this));
        },

        parseRoutes: function(model) {
          // TODO: No need to declare variables here, remove it
          var steps = this.parseRoutesSteps(model.routes);

          this.routes = model.routes;
          this.steps = steps;
        },

        parseRoutesStepsDetails: function(routes) {
          this.iterateThroughtValidRoutes(routes, function(index, route, leg, step) {
            console.log(step.instructions);
          });
        },

        parseRoutesSteps: function(routes) {
          var model,
              steps = [],
              LINE_ID_REGEX = /\s(.*)/i,
              formatLineName = function(name) {
                return name.match(LINE_ID_REGEX)[0].toLowerCase().trim();
              };

          this.iterateThroughtValidRoutes(routes, function(index, route, leg, step) {
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

        iterateThroughtValidRoutes: function(routes, callback) {
          var index,
              hasInnerSteps,
              hasTransitDetails,
              hasValidVehicleType,
              vehicleType;

          index = 0;

          routes.forEach(function(route) {
            route.legs.forEach(function(leg) {
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

        // TODO: maybe change from `forEach` to `$.each`
        filterSubwayRoutes: function(routes) {
          var validRoutes = [];

          this.iterateThroughtValidRoutes(routes, function(index, route) {
            validRoutes.push(route);
          });

          return validRoutes;
        },

        selectRoute: function(index, event) {
          var legs = this.routes[index].legs,
              instruction,
              instructions = [];

          legs.forEach(function(leg) {
            leg.steps.forEach(function(step) {
              instruction = '';
              if(step.transit) {
                instruction = 'Saia da estação ' + step.transit.departure_stop.name;
                instruction += ' e pegue o ' + step.instructions;
              } else {
                instruction = step.instructions;
                instruction = instruction.replace('Ande para', 'Faça baldeação para a estação');
              }
              instructions.push(instruction);
            });
          });

          instructions.push('Ande até seu destino final');

          this.instructions = instructions;

          event.preventDefault();
        }
      },

      setMarker: function() {

      }
    });

  }
);
