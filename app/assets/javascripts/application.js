require.config({
  paths: {
    // Templates
    'partials': '../../assets/partials',

    // Libraries
    'jquery-adapter': '../../../vendor/assets/javascripts/jqueryAdapter',
    'jquery': '../../../vendor/assets/bower/jquery/dist/jquery',
    'mout': '../../../vendor/assets/bower/mout/src',
    'vue': '../../../vendor/assets/bower/vue/dist/vue',
    'q': '../../../vendor/assets/bower/q/q',
    'signals': '../../../vendor/assets/bower/js-signals/dist/signals',
    'hasher': '../../../vendor/assets/bower/hasher/dist/js/hasher',
    'crossroads': '../../../vendor/assets/bower/crossroads.js/dist/crossroads',


    // Google Maps Helpers
    'richmarker': '../../../vendor/assets/bower/google-maps-utility-library-v3/richmarker/src/richmarker',

    // Plugins
    'text': '../../../vendor/assets/bower/text/text',
    'async': '../../../vendor/assets/bower/requirejs-plugins/src/async',

    // Vendor libraries
    'lib': '../../../vendor/assets/javascripts'
  },

  map: {
    'jquery-adapter' : {
      'jquery': 'jquery'
    },

    '*': {
      'jquery': 'jquery-adapter'
    }
  },

  shim: {
    'richmarker': {
      deps: ['lib/gmaps']
    }
  }
});

requirejs(
  [
    'require',
    'jquery',
    'config',
    'vue',
    'lib/gmaps',
    'modules/router',
    'modules/header',
    'modules/navigation',
    'modules/directions',
    'modules/directionsDetail',
    // 'modules/map',
    './sections'
  ],
  function(
    require,
    $,
    config,
    Vue,
    gmaps,
    Router,
    Header,
    Navigation,
    Directions,
    DirectionsDetail,
    // Map,
    Sections
  ) {

    var app;

    function _setupRouter() {
      console.log('application :: _setupRouter() :: Setting up router');

      Router.initialize();
      Router.on.matchRoute.add(function(route) {
        app.setView(route);
      });
    }

    function _setupApp() {
      console.log('application :: _setupApp() :: Setting up app');

      app = new Vue({
        el: '#app',

        components: {
          'overview': Sections.overview,
          'station': Sections.station,
          'header': Header,
          'navigation': Navigation
          // 'directions': Directions,
          // 'directions-detail': DirectionsDetail,
          // 'map': Map
        },

        ready: function() {
          this.$on('app:setView', this.setView);
        },

        data: {
          currentView: 'overview'
        },

        methods: {
          test: function() {
            console.log('testing');
          },

          setView: function(view, options) {
            console.log('application :: setView() :: Should broadcast new view "%s" with options "%s"', view, options);

            // this.currentView = view;
            // this.$broadcast('app:setView:' + view, options);
          }
        }
      });
    }

    function _bootstrap() {
      _setupApp();
      _setupRouter();
    }

    // Bootstrap app on DOM ready.
    $(_bootstrap);
  }
);
