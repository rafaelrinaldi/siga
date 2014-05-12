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
    },

    ready: function() {
      // make sure dom is loaded and then fire the initialization method
      $($.proxy(this.initialize, this));
    },

    methods: {
      initialize: function() {
        this.setMap();
      },

      setMap: function() {
        this.map = new Map('#overview-map');
        this.map.initialize();

        this.map.on.loaded.add(this.setUserLocationMarker, this);
      },

      setUserLocationMarker: function() {
        this.userLocationMarker = this.map.setMarker({
          position: this.map.getCenter(),
          animation: gmaps.Animation.BOUNCE
        });
      },

      placeLine: function(line) {
      }
    }
  });

});
