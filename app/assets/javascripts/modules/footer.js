define(
  [
    'jquery',
    'vue',
    'text!partials/footer.html'
  ],
  function(
    $,
    Vue,
    template
  ) {

    return Vue.extend({
      template: template,

      data: {
      },

      ready: function() {
        this.context = $(this.$el);
        this.$on('footer:show', $.proxy(this.show, this));
        this.$on('footer:hide', $.proxy(this.hide, this));
        this.$on('footer:setControls', $.proxy(this.setControls, this));
      },

      methods: {
        show: function() {
          this.context.removeClass('is-hidden');
        },

        hide: function() {
          this.context.addClass('is-hidden');
        },

        setControls: function(newControls) {
          console.log('footer :: setControls()');
          console.dir(newControls);

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
