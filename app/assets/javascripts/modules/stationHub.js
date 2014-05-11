define(
  [
    'jquery',
    'vue',
    'text!partials/stationHub.html'
  ],
  function
  (
    $,
    Vue,
    template
  ) {

    Vue.component('station-hub', {
      template: template,

      data: {
        show: false,
        station: {
          name: 'Barra Funda',
          lines: [
            {line: 'azul', name: 'Linha Azul'},
            {line: 'verde', name: 'Linha Verde'}
          ],
          address: 'Rua Amaral Nogueira, 133',
          schedule: 'Horário das 11h as 22h',
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta, ea odio quidem suscipit debitis voluptatibus dignissimos! Id, dolorem, nisi, sequi, voluptatibus tempore in corporis iusto minima fugiat consequuntur quibusdam magnam!'
        }
      },

      created: function() {
        var self = this;
        setTimeout(function() {
          self.show = true
        }, 500);
      },

      methods: function() {
      }
    });

  }
);
