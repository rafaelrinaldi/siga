define(
  [
    'jquery',
    'vue',
    'lib/gmaps',
    'text!partials/directions.html'
  ],
  function(
      $,
      Vue,
      gmaps,
      template
  ) {

    Vue.component('directions', {
      template: template,

      data: {
        location: 'Barra Funda',
        destination: 'Pinheiros',
        short: '',
        steps: []
      },

      methods: {
        submit: function(event) {
          this.calcRoute();
          event.stopPropagation();
          event.preventDefault();
        },

        calcRoute: function() {
          var directionsService = new gmaps.DirectionsService();
          var origin = new gmaps.LatLng(-23.647066,-46.63954); // jabaquara
          var destination = new gmaps.LatLng(-23.5554674, -46.6359057); // liberdade
          var request = {
                origin: origin,
                destination: destination,
                travelMode: gmaps.TravelMode.WALKING
          };
          var self = this;
          directionsService.route(request, function(response, status) {
            var steps = [];
            var duration = '';
            var distance = '';
              if (status == google.maps.DirectionsStatus.OK) {
                console.log(response.routes[0]);
                distance = response.routes[0].legs[0].distance.text;
                duration = response.routes[0].legs[0].duration.text;
                self.short = 'Siga pela ' + response.routes[0].summary + ' por aproximadamente ' + duration + ' (total de ' + distance + ')';

                steps = response.routes[0].legs[0].steps;
                self.steps = steps;
              }
            });
        }
      }
    });

  }
);
