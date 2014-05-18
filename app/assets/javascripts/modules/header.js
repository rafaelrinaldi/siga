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
        title: 'Siga',
        controls: [
          {channel: 'navigation:gotoHome', title: 'Location'},
          {channel: 'navigation:toggle', title: 'Menu'}
        ]
      },

      ready: function() {
        this.$on('header:setTitle', this.setTitle);
      },

      methods: {
        setTitle: function(title) {
        },

        // will broadcast the clicked item channel to the app instance
        onClick: function(channel) {
          this.$dispatch(channel);
        }
      }

    });

  }
);
