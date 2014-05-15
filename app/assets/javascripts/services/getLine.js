define(
[
  '../lines'
], function(
  lines
) {

  function getLine(id) {
    return lines[id] || {};
  }

  return getLine;

});
