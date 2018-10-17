const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

module.exports = isEmpty;

// this is the same as the top
// function isEmpty (value) {
//   return (
//     value === undefined || 
//     value === null ||
//     (typeof value === 'object' && Object.keys(value).length === 0) ||
//     (typeof value === 'string' && value.trim(value).length === 0)
//   )
// }
