/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) return "";

  let res = "";
  const arr = string.split('');

  arr.forEach((letter, idx) => {
    let flag = false;

    if (idx >= size) {
      for (let i = idx - 1; i >= idx - size; i--) {
        flag = (arr[i] === letter);
      }
    }

    if (!flag) {
      res += letter;
    }
  });
  return res;
}
