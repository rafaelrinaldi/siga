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
      origin: 'barra funda',
      destination: 'anhangabau',
      lastInput: ''
    },

    attached: function() {
      this.context = $(this.$el);
      this.userInput = this.context.find('.js-user-input');
      this.nearestStation = getStationByName(this.origin);

      this.userInput
        .focusin($.proxy(this.userInputFocus, this))
        // .focusout(function() {
        //   Vue.nextTick($.proxy(self.cleanupSuggestions, self));
        // });
    },

    methods: {
      submit: function(event) {
        // getStationsByName(this.origin);
        console.log('"%s" to "%s"', this.origin, this.destination);
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
      }
    }
  });

});
