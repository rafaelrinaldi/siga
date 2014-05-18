define(
[
  'jquery',
  'vue',
  'lib/gmaps',
  'text!partials/sections/directions.html'
], function(
  $,
  Vue,
  gmaps,
  template
) {

  return Vue.extend({
    template: template,

    data: {
      origin: 'foo',
      destination: 'bar'
    },

    attached: function() {
      // this.context = $(this.$el);
      // this.submit = this.context.find('.js-submit-directions');
    },

    methods: {
      submit: function(event) {
        console.log('"%s" to "%s"', this.origin, this.destination);
      },

      swapUserInput: function() {
        var userInput = {
          origin: this.origin,
          destination: this.destination
        }

        this.destination = userInput.origin;
        this.origin = userInput.destination;
      }
    }
  });

});
