define(['jquery', 'vue', 'text!partials/toolbar.html'], function($, Vue, template) {

  'use strict';

  var _container;

  Vue.component('toolbar', {
    template: template,

    data: {
    },

    ready: function() {
      $(function() {
        _container = $('.container');
      })
    },

    methods: {
      setUserLocation: function() {
        this.$root.$broadcast('map.setUserLocation');
      },

      toggleNavigation: function() {
        this.$root.$broadcast('navigation.toggle');
      }
    }
  });

});
