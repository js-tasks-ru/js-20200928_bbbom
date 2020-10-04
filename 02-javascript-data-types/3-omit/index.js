/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const keys = [...fields];
  const newObj = {};

  Object.entries(obj).forEach(([key, val]) => {
    if (keys.indexOf(key) === -1) {
      newObj[key] = val;
    }
  });

  return newObj;
};
