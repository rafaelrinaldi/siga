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

    data: {
      id: 'estacao-barra-funda',
      isInfoExpanded: false
    },

    attached: function() {
      this.initialize();
    },

    methods: {
      initialize: function() {
        // Notifying section ready.
        this.$dispatch('app:sectionReady', this);

        this.setupMap();

        this.$root.$broadcast('header:setTitle', this.station.title);
        this.$root.$broadcast('header:setControls', [
          {
            channel: 'navigation:historyBack',
            klass: 'ion-ios7-arrow-back'
          },
          {
            channel: 'navigation:toggleStationInfo',
            klass: 'ion-ios7-information-outline'
          }
        ]);

        this.$root.$once('navigation:historyBack', $.proxy(this.historyBack, this));
        this.$root.$on('navigation:toggleStationInfo', $.proxy(this.toggleStationInfo, this));

        this.stationMapContainer = $('#js-station-map-container');
        this.stationInfoContainer = $('#js-station-info-container');
      },

      dispose: function() {
        console.log('station :: dispose()');

        if(this.stationMap) {
          this.stationMap.dispose();
          this.stationMap = null;
        }
      },

      setupMap: function() {
        var id = this.$options.id ? this.$options.id : this.id;

        this.station = getStationById(id);
        this.location = toLatLng(this.station.location);
        this.stationMap = new Map('#station-map', {
          center: this.location,
          zoom: 15
        });
        this.stationMap.initialize();
        this.stationMap.on.loaded.addOnce(this.setMarker, this);

        console.log('station :: setupMap() :: Creating map for "%s" station', id);
      },

      historyBack: function() {
        this.$dispatch('app:setView', 'overview');
      },

      toggleStationInfo: function() {
        var direction,
            EXPANDED_KLASS = 'is-expanded';

        this.isInfoExpanded = !this.isInfoExpanded;

        direction = this.isInfoExpanded ? 'down' : 'up';

        // #yolo
        if(this.isInfoExpanded) {
          this.stationMapContainer.addClass(EXPANDED_KLASS);
          this.stationInfoContainer.addClass(EXPANDED_KLASS);
        } else {
          this.stationMapContainer.removeClass(EXPANDED_KLASS);
          this.stationInfoContainer.removeClass(EXPANDED_KLASS);
        }
      },

      setMarker: function() {
        console.log('station :: setMarkers()');

        var marker,
            area;

        marker = this.stationMap.setMarker({
          position: this.location,
          optimize: false,
          animation: gmaps.Animation.DROP
        });

        area = this.stationMap.setAreaRange({
          marker: marker
        });
      }
    }
  });

});
