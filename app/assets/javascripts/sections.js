define(
[
  'sections/splash',
  'sections/overview',
  'sections/station',
  'sections/line',
  'sections/directions'
], function(
  Splash,
  Overview,
  Station,
  Line,
  Directions
) {

  return {
    'splash': Splash,
    'overview': Overview,
    'station': Station,
    'line': Line,
    'directions': Directions
  };

});
