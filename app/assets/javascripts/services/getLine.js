define(
[
  '../lines'
], function(
  lines
) {

  'use strict';

  function getLine(id) {
    return lines[id] || {};
  }

  return getLine;

});
