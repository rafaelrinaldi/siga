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
        title: 'Status',
        controls: [
          {
            channel: 'navigation:toggleNavigation',
            klass: 'ion-ios7-arrow-back'
          },
          {
            channel: 'navigation:goToSearch',
            klass: 'ion-ios7-search-strong'
          }
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
