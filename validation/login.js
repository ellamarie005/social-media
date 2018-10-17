const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  // for the name will need to be between 2 to 30 characters
  // isLength is a function that is from the validator documentation
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else { // if left blank
    if (!Validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    } // if its not in email form
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    // now the problem is that isValid will need to see if the string is empty or null. 
    // so in this case we will need to create a global function that can be passed to here -- is-empty.js
    // we can create this validation through lodash but we are trying to minimize the libraries that we use so
    isValid: isEmpty(errors)
  };
};