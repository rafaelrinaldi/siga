define(
[
  'jquery',
  'vue',
  'text!partials/sections/line.html'
], function(
  $,
  Vue,
  template
) {

  return Vue.extend({
    template: template
  });

});
