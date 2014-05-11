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
        {id: 'map', title: 'Mapa'},
        {id: 'directions', title: 'Trajetória'},
        {id: 'notifications', title: 'Notificações'}
      ]
    },

    ready: function() {
      this.section = $('.section');
      this.$root.$on('navigation.toggle', this.toggle.bind(this));
    },

    methods: {
      open: function() {
        this.section.toggleClass('retreat');
      },

      close: function() {
        this.section.removeClass('retreat');
      },

      toggle: function() {
        this.isOpen ? this.close() : this.open();
        this.isOpen = !this.isOpen;
      }
    }
  });

});
