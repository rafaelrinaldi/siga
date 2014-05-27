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

    return Vue.extend({
      template: template,

      data: {
        title: '',
        controls: [
        ]
      },

      ready: function() {
        this.$on('header:setTitle', this.setTitle);
        this.$on('header:setControls', this.setControls);
      },

      methods: {
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
