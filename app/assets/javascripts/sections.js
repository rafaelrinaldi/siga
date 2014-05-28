define(
[
  'sections/overview',
  'sections/station',
  'sections/line',
  'sections/directions',
  'sections/directions/detail',
  'sections/search',
  'sections/status'
], function(
  Overview,
  Station,
  Line,
  Directions,
  DirectionsDetail,
  Search,
  Status
) {

  return {
    'overview': Overview,
    'station': Station,
    'line': Line,
    'directions': Directions,
    'directionsDetail': DirectionsDetail,
    'search': Search,
    'status': Status
  };

});
