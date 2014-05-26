define(
  [
    'jquery',
    'vue',
    'text!partials/header.html'
  ],
  function(
    $,
    Vue,
    template
  ) {

    return Vue.extend({
      template: template,

      data: {
        title: 'Status',
        controls: [
          {
            channel: 'navigation:toggleNavigation',
            klass: 'button button-icon icon ion-ios7-arrow-back'
          },
          {
            channel: 'navigation:goToSearch',
            klass: 'button button-icon icon ion-ios7-search-strong'
          }
        ]
      },

      ready: function() {
        this.$on('header:setTitle', this.setTitle);
      },

      methods: {
        setTitle: function(newTitle) {
          this.title = newTitle;
        },

        setControls: function(newControls) {
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
