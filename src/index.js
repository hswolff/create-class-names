function forEach(obj, callback) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      callback(obj[key], key, obj);
    }
  }
}

function mergeStrategy(srcValue, baseVal) {
  if (typeof srcValue !== 'string') {
    return baseVal;
  }

  return `${baseVal} ${srcValue}`;
}

module.exports = function createClassNames(
  base,
  extensions,
  merge = mergeStrategy
) {
  const result = Object.assign({}, base);

  forEach(extensions, (val, key) => {
    if (result.hasOwnProperty(key)) {
      const baseVal = result[key];

      if (typeof val === 'function') {
        result[key] = val(baseVal, key, result);
      } else {
        result[key] = merge(val, baseVal, key, result);
      }
    }
  });

  return result;
};
