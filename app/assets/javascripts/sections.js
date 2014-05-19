define(
[
  'sections/splash',
  'sections/overview',
  'sections/station',
  'sections/line',
  'sections/directions',
  'sections/directions/detail'
], function(
  Splash,
  Overview,
  Station,
  Line,
  Directions,
  DirectionsDetail
) {

  return {
    'splash': Splash,
    'overview': Overview,
    'station': Station,
    'line': Line,
    'directions': Directions,
    'directionsDetail': DirectionsDetail
  };

});
