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
      var self = this;
      setTimeout(function() {
        self.$dispatch('app:setView', 'overview');
      }, 2000);
    },

    methods: {
      dispose: function() {
      }
    }
  });

});
