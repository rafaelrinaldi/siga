define(
[
  'jquery',
  'vue',
  'text!partials/sections/splash.html'
], function(
  $,
  Vue,
  template
) {

  return Vue.extend({
    template: template,

    ready: function() {
      this.$dispatch('app:sectionReady', this);
      this.$root.$broadcast('header:hide');
      var self = this;
      setTimeout(function() {
        self.$dispatch('app:setView', 'directions');
      }, 200);
    },

    methods: {
      dispose: function() {
      }
    }
  });

});
