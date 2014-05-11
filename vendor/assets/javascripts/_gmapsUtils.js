define(
  [
    'exports',
    'gmaps'
  ],
  function (exports, gmaps) {

    // google maps generic helpers
    // ---------------------------
    // author: Miller Medeiros


    exports.getMarkersBounds = function (markers) {
      return this.getBounds(this.getMarkersLatLngs(markers));
    };


    exports.getMarkersLatLngs = function (markers) {
      var latLngs = [];
      var marker, i = 0;
      while (marker = markers[i++]) {
        latLngs.push(marker.getPosition());
      }
      return latLngs;
    };


    exports.getBounds = function (latLngs) {
      var bounds = new gmaps.LatLngBounds();
      var latLng, i = 0;
      while (latLng = latLngs[i++]) {
        bounds.extend(latLng);
      }
      return bounds;
    };


    exports.fitMarkers = function (map, markers) {
      map.fitBounds(this.getMarkersBounds(markers));
    };


    exports.fitLatLngs = function (map, latLngs) {
      map.fitBounds(this.getBounds(latLngs));
    };


    exports.unionBounds = function (boundsArr) {
      var bounds = new gmaps.LatLngBounds();
      var b, i = 0;
      while (b = boundsArr[i++]) {
        bounds = bounds.union(b);
      }
      return bounds;
    };


    // offset bounds by pixels
    // ---
    // [projection] should be a MapCanvasProjection or a Map instance
    // it needs the Zoom level to work properly...
    // if you want to expand bounds use positive [offsetRight],
    // [offsetBottom] and negative [offsetLeft], [offsetTop].
    exports.offsetBounds = function (bounds, projection, offsetTop, offsetRight, offsetBottom, offsetLeft) {
      offsetTop = offsetTop || 0;
      offsetRight = offsetRight || 0;
      offsetBottom = offsetBottom || 0;
      offsetLeft = offsetLeft || 0;

      var sw = bounds.getSouthWest();
      var ne = bounds.getNorthEast();
      sw = exports.offsetPosition(sw, projection, offsetLeft, offsetBottom);
      ne = exports.offsetPosition(ne, projection, offsetRight, offsetTop);

      return new gmaps.LatLngBounds(sw, ne);
    };


    // offset LatLng based on MapCanvasProjection or Map (in pixels)
    exports.offsetPosition = function (position, projection, offsetX, offsetY) {
      offsetX = offsetX || 0;
      offsetY = offsetY || 0;

      var point, destPoint;

      if ('fromLatLngToDivPixel' in projection) {
        // MapCanvasProjection
        point = projection.fromLatLngToDivPixel(position);
        destPoint = exports.offsetPoint(point, offsetX, offsetY);
        return projection.fromDivPixelToLatLng(destPoint);
      } else {
        // can't use regular Projection (since it needs zoom)
        point = exports.fromLatLngToPoint(projection, position);
        destPoint = exports.offsetPoint(point, offsetX, offsetY);
        return exports.fromPointToLatLng(projection, destPoint);
      }
    };


    // yes, this sucks
    // based on: http://qfox.nl/notes/116
    exports.fromLatLngToPoint = function (map, latlng, zoom) {
      zoom = zoom || map.getZoom();
      var normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
      var scale = Math.pow(2, zoom);
      var pixelCoordinate = new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale);
      return pixelCoordinate;
    };


    // yes, this sucks
    // based on: http://qfox.nl/notes/116
    exports.fromPointToLatLng = function (map, point, zoom) {
      zoom = zoom || map.getZoom();
      var scale = Math.pow(2, zoom);
      var normalizedPoint = new google.maps.Point(point.x / scale, point.y / scale);
      var latlng = map.getProjection().fromPointToLatLng(normalizedPoint);
      return latlng;
    };


    // offset point position
    exports.offsetPoint = function (point, offsetX, offsetY) {
      return new gmaps.Point(point.x + offsetX, point.y + offsetY);
    };


  }
);
