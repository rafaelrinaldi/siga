define(
  [
    'jquery',
    'vue',
    'config',
    'lib/gmaps',
    'lib/gmapsUtils',
    'q',
    'text!partials/map.html'
  ],
  function(
    $,
    Vue,
    config,
    gmaps,
    gmapsUtils,
    Q,
    template
  ) {

  return Vue.extend({
    template: template,

    data: {
    },

    attached: function() {
      var self = this;
      $(function() {
        self.map = new gmaps.Map($('#map').get(0));
        self.settings = config.mapSettings;
        self.$on('map.setUserLocation', self.setUserLocation);
        self.$emit('map.setUserLocation');
      });
    },

    methods: {

      getUserLocation: function() {
        var deferred = Q.defer();

        if(!navigator.geolocation) {
          deferred.reject(new Error('Browser doesn\'t support geolocation feature, using fallback coordinates'));
        }

        navigator.geolocation.getCurrentPosition(
          function(position) {
            deferred.resolve(position.coords);
          },

          function() {
            deferred.reject(new Error('User chose not to allow geolocation feature, using fallback coordinates'));
          }
        );

        return deferred.promise;
      },

      setUserLocation: function() {
        var self = this;

        // attempts to automatically retrieve user's location
        // if something goes wrong it uses the fallback location (which are IED coordinates)
        this.getUserLocation()
          .then(function(position) {
            self.setCenter(position);
            self.setLocationMarker(position);
          })
          .catch(function(error) {
            console.warn(error.message);
            self.setCenter(self.settings)
            self.setLocationMarker(self.settings);
          })
          .done();
      },

      setCenter: function(coordinates) {
        var self = this,
            coordinates = coordinates,
            center = new gmaps.LatLng(coordinates.latitude, coordinates.longitude),
            options = {
              zoom: self.settings.zoom,
              center: center,
              streetViewControl: false,
              mapTypeControl: false,
              zoomControl: false,
              panControl: false
            };

        this.map.setOptions(options);
        // this.map.panTo(center);
      },

      setLocationMarker: function() {
        // won't set user location marker if already did
        if(this.userMarker) {
          return;
        }

        // var div = document.createElement('DIV');
        // div.innerHTML = '<div class="marker"><span class="marker__label">1</span></div>';

        // marker = new RichMarker({
        //   position: _map.getCenter(),
        //   map: _map,
        //   flat: true,
        //   anchor: gmapsUtils.RichMarkerPosition.MIDDLE,
        //   content: div
        // });

        // var marker = new gmaps.Marker({
        //   position: _map.getCenter(),
        //   icon: {
        //     path: gmaps.SymbolPath.CIRCLE,
        //     scale: 10
        //   },
        //   animation: gmaps.Animation.DROP,
        //   title: 'test',
        //   map: _map
        // });

        var marker = new gmaps.Marker({
          position: this.map.getCenter(),
          animation: gmaps.Animation.BOUNCE,
          map: this.map
        });

        this.userMarker = marker;
      },

      setMarker: function(coordinates) {
        return;
        var marker = new gmaps.Marker({
          position: new gmaps.LatLng(coordinates.latitude, coordinates.longitude),
          icon: {
            path: gmaps.SymbolPath.CIRCLE,
            scale: 10
          }
        });
      },

      removeMarker: function(marker) {
        marker.setMap(null);
      }

    }
  });

});
