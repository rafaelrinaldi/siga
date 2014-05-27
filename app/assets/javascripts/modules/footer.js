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
        this.$on('footer:setControls', this.setControls);
      },

      methods: {
        setTitle: function(newTitle) {
        },

        setControls: function(newControls) {
          console.log('footer :: setControls()');
          console.dir(newControls);

          this.controls = newControls;
        },

        // will broadcast the clicked item channel to the app instance
        onClick: function(channel) {
          console.log('onClick', channel);
          // this.$dispatch(channel);
        }
      }

    });

  }
);
