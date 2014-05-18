define(
[
  'sections/overview',
  'sections/station',
  'sections/line'
], function(
  Overview,
  Station,
  Line
) {

  return {
    'overview': Overview,
    'station': Station,
    'line': Line
  };

});
