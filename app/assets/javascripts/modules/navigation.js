define(
  [
    'jquery',
    'vue',
    'mout/random/choice',
    'text!partials/navigation.html'
  ],
  function(
    $,
    Vue,
    choice,
    template
  ) {

  return Vue.extend({
    template: template,

    data: {
      isOpen: false,
      colors: ['blue', 'yellow', 'red', 'purple', 'green'],
      items: [
        {id: 'overview', title: 'Mapa'},
        {id: 'station', title: 'Detalhe estação'}
      ]
    },

    ready: function() {
      this.mainSection = $('#js-section');
      this.mainHeader = $('#js-header');
      this.context = $(this.$el);

      this.$root.$on('navigation:toggleNavigation', $.proxy(this.toggle, this));
      this.$root.$on('navigation:gotoHome', $.proxy(this.gotoHome, this));

      this.setRandomColor();
    },

    methods: {
      setRandomColor: function() {
        var color = choice(this.colors);
        this.context.addClass(color);
      },

      getCurrentSection: function() {
        return $('#js-section');
      },

      open: function() {
        this.context.removeClass('is-hidden');
        this.mainHeader.addClass('is-hidden');
        this.getCurrentSection().addClass('is-hidden');
      },

      close: function() {
        this.context.addClass('is-hidden');
        this.mainHeader.removeClass('is-hidden');
        this.getCurrentSection().removeClass('is-hidden');
      },

      gotoHome: function() {
        this.$dispatch('app:setView', 'overview');
      },

      toggle: function() {
        this.isOpen ? this.close() : this.open();
        this.isOpen = !this.isOpen;
      }
    }
  });

});
