/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const arr = [...fields];
  const newObj = [];

  if (Object.keys(obj).length === 0 || arr.length === 0) return {};

  Object.entries(obj).forEach( ([key, val]) => {
    if (arr.indexOf(key) === -1){
      newObj.push([key, val]);
    }
  });

  return newObj.length > 0 ? Object.fromEntries(newObj) : {};
};
