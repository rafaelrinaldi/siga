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
    'mout/object/mixIn',
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
    mixIn,
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
          'line': Sections.line,
          'header': Header,
          'navigation': Navigation
        },

        ready: function() {
          this.$on('app:sectionReady', this.sectionReady);
          this.$on('app:setView', this.setView);
        },

        data: {
          currentView: 'overview'
        },

        methods: {
          // TODO: Find a better approach to do this.
          sectionReady: function(section) {
            // Merge section data with options that were passed on `app:setView`
            // TODO: Change this from $data to $options.
            section.$data = $.extend(section.$data, this.currentViewOptions);
          },

          /**
           * Setup a new view.
           * @param {String} view View id.
           * @param {Object} options Options (optional).
           */
          setView: function(view, options) {
            var log = 'application :: setView() :: Should broadcast new view "%s"';

            if(options) {
              log += ' with options "%s"';
            }

            console.log(log, view, options);

            this.currentView = view;
            this.currentViewOptions = options;
          }
        }
      });
    }

    function _bootstrap() {
      Vue.config('debug', config.debug);

      _setupApp();
      _setupRouter();
    }

    // Bootstrap app on DOM ready.
    $(_bootstrap);
  }
);
