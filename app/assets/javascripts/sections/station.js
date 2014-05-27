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
      toggleIcon: {
        klass: '',
        label: '',
        labels: {
          up: 'Mostrar informações',
          down: 'Esconder informações'
        }
      },
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

        this.stationMapContainer = $('#js-station-map-container');
        this.stationInfoContainer = $('#js-station-info-container');

        this.toggleIcon.klass = 'up';
        this.toggleIcon.label = this.toggleIcon.labels['up'];
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

      toggleStationInfo: function() {
        var direction,
            margin;

        this.isInfoExpanded = !this.isInfoExpanded;

        direction = this.isInfoExpanded ? 'down' : 'up';
        margin = !this.isInfoExpanded ? 0 : '-520px';

        this.stationMapContainer.css({'-webkit-transform': 'translateY(-80%)'});
        this.stationInfoContainer.css({'-webkit-transform': 'translateY(-135%)'});

        // this.stationMapContainer.css({marginTop: margin});

        this.toggleIcon.klass = direction;
        this.toggleIcon.label = this.toggleIcon.labels[direction];
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
