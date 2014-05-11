define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'services/getUserLocation',
  'services/getStationByName',
  'helpers/createMap',
  'text!partials/sections/overview.html'
], function(
  $,
  Vue,
  gmaps,
  getUserLocation,
  getStationByName,
  createMap,
  template
) {

  return Vue.extend({
    template: template,

    data: {
      foo: 'bar'
    },

    ready: function() {
      // make sure dom is loaded and then fire the initialization method
      $($.proxy(this.initialize, this));
    },

    methods: {
      initialize: function() {
        this.map = createMap('#overview-map');

        // console.log(getStationById('estacao-barra-funda'));
        console.log(getStationByName('anhangabau'));
      },

      placeLine: function(line) {
      }
    }
  });

});
