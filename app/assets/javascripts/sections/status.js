define(
[
  'jquery',
  'vue',
  'text!partials/sections/status.html'
], function(
  $,
  Vue,
  template
) {

  return Vue.extend({
    template: template
  });

});
