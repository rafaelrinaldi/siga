define(
  [
    'jquery',
    'vue',
    'text!partials/directions.html'
  ],
  function(
    $,
    Vue,
    template
  ) {

    'use strict';

    /**
     * Directions section.
     * This section offers the user a way to get information on how to go from
     * point A to point B.
     */

    return Vue.extend({
      template: template,

      data: {
        route: '',
        origin: 'brigadeiro',
        destination: 'anhangabau'
      },

      methods: {
        submit: function(event) {
          this.$root.$emit('app:setView', 'directions-detail', this.serialize());
          event.preventDefault();
        },

        serialize: function() {
          return {origin: this.origin, destination: this.destination};
        },

        setOriginPoint: function(event) {
          event.preventDefault();
          this.origin = this.route;
        },

        setDestinationPoint: function(event) {
          event.preventDefault();
          this.destination = this.route;
        }
      }
    });

  }
);
