define(
[
  'sections/splash',
  'sections/overview',
  'sections/station',
  'sections/line'
], function(
  Splash,
  Overview,
  Station,
  Line
) {

  return {
    'splash': Splash,
    'overview': Overview,
    'station': Station,
    'line': Line
  };

});
