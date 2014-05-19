define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'services/getStationByName',
  'services/getStationsByName',
  'text!partials/sections/directions.html'
], function(
  $,
  Vue,
  gmaps,
  getStationByName,
  getStationsByName,
  template
) {

  return Vue.extend({
    template: template,

    data: {
      suggestions: [],
      origin: 'tamanduatei',
      destination: 'itaquera',
      lastInput: ''
    },

    attached: function() {
      this.$dispatch('app:sectionReady', this);
      this.initialize();
    },

    methods: {
      initialize: function() {
        this.context = $(this.$el);
        this.userInput = this.context.find('.js-user-input');
        this.nearestStation = getStationByName(this.origin);

        this.userInput
          .focusin($.proxy(this.userInputFocus, this))
          // .focusout(function() {
          //   Vue.nextTick($.proxy(self.cleanupSuggestions, self));
          // });
      },

      submit: function(event) {
        // getStationsByName(this.origin);
        // console.log('"%s" to "%s"', this.origin, this.destination);
        this.$dispatch('app:setView', 'directions-detail', {
          origin: this.origin,
          destination: this.destination
        });
      },

      suggestStations: function(input) {
        this.suggestions = getStationsByName(this[input]);
      },

      selectSuggestion: function(suggestion) {
        if(this.lastInput && this.lastInput.length) {
          this[this.lastInput] = suggestion;
        }
      },

      cleanupSuggestions: function() {
        this.suggestions = [];
      },

      swapUserInput: function() {
        var userInput = {
          origin: this.origin,
          destination: this.destination
        };

        this.destination = userInput.origin;
        this.origin = userInput.destination;
      },

      userInputFocus: function(event) {
        var id = $(event.currentTarget).attr('id');

        this.lastInput = id;
      },

      getNearbyStation: function(location) {
        this.origin = this.nearestStation.title;
      },

      dispose: function() {
        if(this.userInput) {
          this.userInput.off('focusin');
        }

        if(this.suggestions) {
          this.suggestions.length = 0;
          this.suggestions = null;
        }
      }
    }
  });

});
