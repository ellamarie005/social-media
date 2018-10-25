const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  // data.name will first check if its empty first. if it is then get passed on to the if statement below
  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  // for the name will need to be between 2 to 30 characters
  // isLength is a function that is from the validator documentation
  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  } // if left blank

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  } else { // if left blank
    if (!Validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    } // if its not in email form
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  } else {// if left blank
    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = 'Password must be at least 6 characters';
    } // if password is not between 6 to 30 characters
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm password field is required';
  } // if left blank
  else {
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = 'Password must match';
    }
  }// if the 2nd password does not match first password

  return {
    errors,
    // now the problem is that isValid will need to see if the string is empty or null. 
    // so in this case we will need to create a global function that can be passed to here -- is-empty.js
    // we can create this validation through lodash but we are trying to minimize the libraries that we use so
    isValid: isEmpty(errors)
  };
};
