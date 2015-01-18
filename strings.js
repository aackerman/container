var STRING_CAMELIZE_REGEXP = (/(\-|_|\.|\s)+(.)?/g);

let camelize = (key) => {
  return key.replace(STRING_CAMELIZE_REGEXP, function(match, separator, chr) {
    return chr ? chr.toUpperCase() : '';
  }).replace(/^([A-Z])/, function(match, separator, chr) {
    return match.toLowerCase();
  });
}

let classify = (str) => {
  var parts = str.split(".");
  var out = [];

  for (var i=0, l=parts.length; i<l; i++) {
    var camelized = camelize(parts[i]);
    out.push(camelized.charAt(0).toUpperCase() + camelized.substr(1));
  }

  return out.join(".");
};

export default { camelize, classify };
