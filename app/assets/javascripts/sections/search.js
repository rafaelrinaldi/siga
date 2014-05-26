define(
[
  'jquery',
  'vue',
  'text!partials/sections/search.html'
], function(
  $,
  Vue,
  template
) {

  return Vue.extend({
    template: template
  });

});
