define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'services/getUserLocation',
  'services/getStationByName',
  'modules/map',
  'text!partials/sections/overview.html'
], function(
  $,
  Vue,
  gmaps,
  getUserLocation,
  getStationByName,
  Map,
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
        this.map = new Map('#overview-map');
        this.map.initialize();
      },

      setUserLocationMarker: function() {

      },

      placeLine: function(line) {
      }
    }
  });

});
