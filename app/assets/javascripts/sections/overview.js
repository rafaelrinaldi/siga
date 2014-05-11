define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'services/getUserLocation',
  'text!partials/sections/overview.html'
], function(
  $,
  Vue,
  gmaps,
  getUserLocation,
  template
) {

  return Vue.extend({
    template: template,

    data: {
    },

    ready: function() {
      console.log('attached');
      var self = this;
      $(function() {
        self.map = new gmaps.Map($('#overview-map').get(0));
        console.log('getting user location');
        // self.settings = config.mapSettings;
        // self.$on('map.setUserLocation', self.setUserLocation);
        // self.$emit('map.setUserLocation');
        //
        getUserLocation()
          .then(function(coordinates) {
            console.log('it works!', coordinates);
          })
      });
    },

    methods: {
    }
  });

});
