define(
[
  'jquery',
  'vue',
  'data/status',
  'services/getLine',
  'text!partials/sections/status.html'
], function(
  $,
  Vue,
  status,
  getLine,
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
        this.$dispatch('app:sectionReady', this);

        this.$root.$broadcast('header:show');
        this.$root.$broadcast('footer:hide');
        this.$root.$broadcast('header:setTitle', 'Status');
        this.$root.$broadcast('header:setControls', [
          {
            channel: 'navigation:toggleNavigation',
            klass: 'ion-navicon'
          },
          {
          }
        ]);

        this.lastUpdate = status['last-updated'];

        this.parseStatus();
      },

      parseStatus: function() {
        var self = this,
            operationalStatus = [],
            title,
            message,
            icon,
            color;

        $.each(status.status, function(key, value) {
          message = self.parseMessage(value['operational-status']);
          title = getLine(key).title;
          icon = self.parseIcon(value['operational-status']);
          color = self.parseColor(value['operational-status']);
          operationalStatus.push({
            title: title,
            message: message,
            icon: icon,
            color: color
          })
        });

        this.operationalStatus = operationalStatus;

        this.$dispatch('app:sectionLoaded');
      },

      parseMessage: function(id) {
        var messages = {
              'normal-operation': 'Operação normal',
              'partial-operation': 'Operação parcial',
              'reduced-speed': 'Rodando com velocidade reduzida',
              'stagnant': 'Linha paralisada',
              'data-unavailable': 'Dados indisponíveis no momento',
              'operation-closed': 'Operação encerrada por hora'
            },
            message = messages[id];
        return message;
      },

      parseIcon: function(id) {
        var icons = {
          'normal-operation': 'ion-checkmark-circled',
          'partial-operation': 'ion-information-circled',
          'reduced-speed': 'ion-information-circled',
          'stagnant': 'ion-close-circled',
          'data-unavailable': 'ion-close-circled',
          'operation-closed': 'ion-close-circled'
        },
        icon = icons[id];
        return icon;
      },

      parseColor: function(id) {
        var colors = {
          'normal-operation': '#27ae60',
          'partial-operation': '#f1c40f',
          'reduced-speed': '#f1c40f',
          'stagnant': '#ef4e3a',
          'data-unavailable': '#ef4e3a',
          'operation-closed': '#ef4e3a'
        },
        color = colors[id];

        return color;
      },

      dispose: function() {
      }
    }
  });

});
