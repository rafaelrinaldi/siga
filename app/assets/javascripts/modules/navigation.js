define(
  [
    'jquery',
    'vue',
    'text!partials/navigation.html'
  ],
  function(
    $,
    Vue,
    template
  ) {

  return Vue.extend({
    template: template,

    data: {
      isOpen: false,
      items: [
        {id: 'overview', title: 'Mapa'},
        {id: 'station', title: 'Detalhe estação'}
      ]
    },

    ready: function() {
      this.$root.$on('navigation:toggle', $.proxy(this.toggle, this));
      this.$root.$on('navigation:gotoHome', $.proxy(this.gotoHome, this));
    },

    methods: {
      getCurrentSection: function() {
        return $('.section');
      },

      open: function() {
        this.getCurrentSection().toggleClass('retreat');
      },

      close: function() {
        this.getCurrentSection().removeClass('retreat');
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
