define(
[
  'jquery',
  'vue',
  'services/getLineStations',
  'text!partials/sections/line.html'
], function(
  $,
  Vue,
  getLineStations,
  template
) {

  'use strict';

  return Vue.extend({
    template: template,

    data: {},

    attached: function() {
      this.initialize();
    },

    methods: {
      initialize: function() {
        // Notifying section ready.
        this.$dispatch('app:sectionReady', this);

        this.$root.$broadcast('header:setTitle', this.station.title);
        this.$root.$broadcast('header:setControls', [
          {
            channel: 'navigation:goToStation',
            klass: 'ion-ios7-arrow-back'
          },

          {
            klass: ''
          }
        ]);

        this.$root.$once('navigation:goToStation', $.proxy(this.goToStation, this));
        this.setupStations();
      },

      setupStations: function() {
        this.lineId = this.$options.line.id;
        this.stations = getLineStations(this.$options.line.id);
        this.$root.$broadcast('header:setTitle', this.$options.line.title);
        this.$dispatch('app:sectionLoaded');
      },

      dispose: function() {
        console.log('line :: dispose()');
      },

      goToStation: function() {
        this.$dispatch('app:setView', 'station', {id: this.$options.station.id});
      }
    }
  });

});
