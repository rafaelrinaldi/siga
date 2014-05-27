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
    'hammerjs': '../../../vendor/assets/bower/hammerjs/hammer',

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
    'modules/footer',
    'modules/directions',
    'modules/directionsDetail',
    './sections',
    'lib/vueTouch',
    'lib/h5bpHelpers'
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
    Footer,
    Directions,
    DirectionsDetail,
    Sections,
    vueTouch
  ) {

    var app;

    function _setupRouter() {
      console.log('application :: _setupRouter() :: Setting up router');

      Router.initialize();
      Router.on.matchRoute.add(function(route) {
        app.setView(route);
      });
    }

    function _checkForIOS() {
      var isIOS = /(ipod|iphone|ipad)/i.test(navigator.userAgent);

      if(isIOS) {
        $('body').addClass('is-ios');
      }
    }

    function _setupApp() {
      console.log('application :: _setupApp() :: Setting up app');

      // Setup touch plugin
      Vue.use(vueTouch);

      app = new Vue({
        el: '#app',

        components: {
          'splash': Sections.splash,
          'overview': Sections.overview,
          'station': Sections.station,
          'line': Sections.line,
          'status': Sections.status,
          'search': Sections.search,
          'directions': Sections.directions,
          'directions-detail': Sections.directionsDetail,
          'header': Header,
          'navigation': Navigation,
          'footer': Footer
        },

        ready: function() {
          this.$on('app:sectionReady', this.sectionReady);
          this.$on('app:setView', this.setView);
          this.$watch('currentView', this.currentViewChanged);
        },

        data: {
          // currentView: 'splash'
        },

        methods: {
          // TODO: Find a better approach to do this.
          sectionReady: function(section) {
            // Merge section data with options that were passed on `app:setView`
            section.$options = this.currentViewOptions;
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
              console.log(log, view, options);
            } else {
              options = {};
              console.log(log, view);
            }

            this.currentView = view;
            this.currentViewOptions = options;
          },

          currentViewChanged: function() {
            Vue.nextTick(this.$.currentView.dispose);
          }
        }
      });
    }

    function _fixKnownIssues() {
      $(function() {
        setTimeout(MBP.scaleFix, 0);
        setTimeout(MBP.gestureStart, 100);
        setTimeout(MBP.hideUrlBarOnLoad, 250);
      });
    }

    function _bootstrap() {
      Vue.config('debug', config.debug);

      _fixKnownIssues();
      _checkForIOS();
      _setupApp();
    }

    // Bootstrap app on DOM ready.
    $(_bootstrap);
  }
);
