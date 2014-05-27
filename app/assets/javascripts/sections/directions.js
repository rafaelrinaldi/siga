define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'services/getLine',
  'services/getStationByName',
  'services/getStationsByName',
  'text!partials/sections/directions.html'
], function(
  $,
  Vue,
  gmaps,
  getLine,
  getStationByName,
  getStationsByName,
  template
) {

  return Vue.extend({
    template: template,

    data: {
      suggestions: [],
      // origin: 'Brigadeiro',
      // destination: 'Anhangabaú',
      lastInput: ''
    },

    ready: function() {
      this.$dispatch('app:sectionReady', this);
      this.$root.$broadcast('header:hide');
      this.$root.$broadcast('footer:setControls', [
        {
          klass: 'ion-navigate',
          title: 'Mais próxima',
          channel: 'directions:getNearbyStation'
        },

        {
          klass: 'ion-shuffle',
          title: 'Inverter ordem',
          channel: 'directions:swapUserInput'
        },

        {
          klass: 'ion-ios7-location',
          title: 'Direção',
          channel: 'directions:submit'
        }
      ]);

      this.$root.$on('directions:getNearbyStation', $.proxy(this.getNearbyStation, this));
      this.$root.$on('directions:swapUserInput', $.proxy(this.swapUserInput, this));
      this.$root.$on('directions:submit', $.proxy(this.submit, this));

      this.initialize();
    },

    methods: {
      initialize: function() {
        this.context = $(this.$el);
        this.userInputGroup = this.context.find('.js-user-input-group');
        this.userInput = this.context.find('.js-user-input');
        this.nearestStation = getStationByName(this.origin);

        this.userInput
          .focusin($.proxy(this.userInputFocus, this))
          .focusout($.proxy(this.userInputFocusOut, this));
      },

      submit: function(event) {
        this.$dispatch('app:setView', 'directions-detail', {
          origin: this.origin,
          destination: this.destination
        });
      },

      suggestStations: function(input) {
        var suggestions = getStationsByName(this[input]);

        // Combine line details to stations models to display colors and stuff
        this.suggestions =  $.each(suggestions, function(index, suggestion) {
                              $.map(suggestion.lines, function(line) {
                                return $.extend(line, getLine(line.id));
                              });
                            });
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
        var target = $(event.currentTarget),
            id = target.attr('id');

        this.lastInput = id;
      },

      userInputFocusOut: function() {
        this.cleanupSuggestions();
      },

      getNearbyStation: function(location) {
        this.origin = this.nearestStation.title;
      },

      dispose: function() {
        if(this.userInput) {
          this.userInput
            .off('focusin')
            .off('focusout');
        }

        if(this.suggestions) {
          this.suggestions.length = 0;
          this.suggestions = null;
        }
      }
    }
  });

});
