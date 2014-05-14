define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'modules/map',
  'services/getStationById',
  'text!partials/sections/station.html'
], function(
  $,
  Vue,
  gmaps,
  Map,
  getStationById,
  template
) {

  return Vue.extend({
    template: template,

    data: {
      id: ''
    },

    ready: function() {
      // make sure dom is loaded and then fire the initialization method
      $($.proxy(this.initialize, this));
    },

    methods: {
      initialize: function() {
        console.log('yo');
      }
    }
  });

});
