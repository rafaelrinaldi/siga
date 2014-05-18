define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'modules/map',
  'services/getStationById',
  'helpers/toLatLng',
  'text!partials/sections/station.html'
], function(
  $,
  Vue,
  gmaps,
  Map,
  getStationById,
  toLatLng,
  template
) {

  return Vue.extend({
    template: template,

    id: 'estacao-barra-funda',

    replace: true,

    attached: function() {
      this.initialize();
    },

    methods: {
      initialize: function() {
        // Notifying section ready.
        this.$dispatch('app:sectionReady', this);

        this.setupMap();
      },

      dispose: function() {
        console.log('station :: dispose()');

        if(this.stationMap) {
          this.stationMap.dispose();
          this.stationMap = null;
        }
      },

      setupMap: function() {
        var id = this.$options ? this.$options.id : 'estacao-barra-funda';

        this.station = getStationById(id);
        this.location = toLatLng(this.station.location);
        this.stationMap = new Map('#station-map', {
          center: this.location,
          zoom: 17,
          // mapTypeId: gmaps.MapTypeId.TERRAIN
        });
        this.stationMap.initialize();
        this.stationMap.on.loaded.addOnce(this.setMarker, this);

        console.log('station :: setupMap() :: Creating map for "%s" station', id);
      },

      setMarker: function() {
        console.log('station :: setMarkers()');

        var marker,
            area;

        marker = this.stationMap.setMarker({
          position: this.location,
          animation: gmaps.Animation.BOUNCE
        });

        area = this.stationMap.setAreaRange({
          marker: marker
        });
      }
    }
  });

});
