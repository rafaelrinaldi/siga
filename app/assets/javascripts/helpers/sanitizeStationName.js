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

  function sanitizeStationName(name) {
    name = toString(name);
    name = trim(name);
    name = replaceAccents(name);

    return name;
  }

  return sanitizeStationName;

});
