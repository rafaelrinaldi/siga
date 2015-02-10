define(
[
  'mout/lang/toString',
  'mout/string/trim',
  'mout/string/replaceAccents'
], function(
  toString,
  trim,
  replaceAccents
) {

  'use strict';

  /**
   * Remove the noise and normalize station names.
   * @param  {String} name Original name
   * @return {String}      Normalized name
   */

  function sanitizeStationName(name) {
    name = toString(name);
    name = trim(name);
    name = replaceAccents(name);

    return name;
  }

  return sanitizeStationName;

});
