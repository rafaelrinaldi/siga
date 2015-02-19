define(
  [
    'jquery',
    'vue',
    'mout/object/mixIn',
    'text!partials/header.html'
  ],
  function(
    $,
    Vue,
    mixIn,
    template
  ) {

    'use strict';

    /**
     * Main header element.
     */

    return Vue.extend({
      template: template,

      data: {
        title: '',
        controls: [
        ]
      },

      ready: function() {
        this.context = $(this.$el);
        this.$on('header:setTitle', this.setTitle);
        this.$on('header:setControls', this.setControls);
        this.$on('header:show', $.proxy(this.show, this));
        this.$on('header:hide', $.proxy(this.hide, this));
      },

      methods: {
        show: function() {
          this.context.removeClass('is-hidden');
        },

        hide: function() {
          this.context.addClass('is-hidden');
        },

        setTitle: function(newTitle) {
          console.log('header :: setTitle() ::', newTitle);
          this.title = newTitle;
        },

        setControls: function(newControls, shouldExtend) {
          console.log('header :: setControls()');
          console.dir(newControls);

          if(shouldExtend) {
            newControls = mixIn(this.controls, newControls);
          }

          this.controls = newControls;
        },

        // will broadcast the clicked item channel to the app instance
        onClick: function(channel) {
          this.$dispatch(channel);
        }
      }

    });

  }
);
