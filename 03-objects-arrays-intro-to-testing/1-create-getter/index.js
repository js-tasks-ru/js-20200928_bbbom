/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const fields = path.split('.');

  return function getValue(obj) {
    if (fields.length === 1) {
      return obj[path];
    }
    return fields.reduce((prev, next) => {
      if (!prev) return;
      return prev[next];
    }, obj);
  };
}
