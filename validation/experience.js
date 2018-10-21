const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';


  if (Validator.isEmpty(data.title)) {
    errors.title = 'Title field is required';
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company field is required';
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = 'From field is required';
  }

  return {
    errors,
    // now the problem is that isValid will need to see if the string is empty or null. 
    // so in this case we will need to create a global function that can be passed to here -- is-empty.js
    // we can create this validation through lodash but we are trying to minimize the libraries that we use so
    isValid: isEmpty(errors)
  };
};