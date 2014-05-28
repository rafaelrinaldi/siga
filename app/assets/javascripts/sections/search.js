define(
[
  'jquery',
  'vue',
  'services/getStationByName',
  'services/getStationsByName',
  'services/getLine',
  'text!partials/sections/search.html'
], function(
  $,
  Vue,
  getStationByName,
  getStationsByName,
  getLine,
  template
) {

  return Vue.extend({
    template: template,

    data: {
      suggestions: []
    },

    attached: function() {
      this.initialize();
    },

    methods: {
      initialize: function() {
        this.$dispatch('app:sectionReady', this);

        this.$root.$broadcast('header:show');
        this.$root.$broadcast('footer:hide');
        this.$root.$broadcast('header:setTitle', 'Busca');
        this.$root.$broadcast('header:setControls', [
          {
            channel: 'navigation:toggleNavigation',
            klass: 'ion-navicon'
          },
          {
            channel: 'navigation:search:submitKeyword',
            klass: 'ion-ios7-search'
          }
        ]);

        this.$root.$once('navigation:search:submitKeyword', $.proxy(this.submitKeyword, this));

        this.$dispatch('app:sectionLoaded');
      },

      suggestStations: function(input) {
        var suggestions = getStationsByName(this.keyword);

        // Combine line details to stations models to display colors and stuff
        this.suggestions =  $.each(suggestions, function(index, suggestion) {
                              $.map(suggestion.lines, function(line) {
                                return $.extend(line, getLine(line.id));
                              });
                            });
      },

      selectSuggestion: function(suggestion) {
        this.keyword = suggestion;
      },

      dispose: function() {

      },

      cleanupSuggestions: function() {
        this.suggestions = [];
      },

      submitKeyword: function() {
        var model = getStationByName(this.keyword);
        this.$dispatch('app:setView', 'station', {id: model.id});
      }
    }
  });

});
