const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  


  if (Validator.isEmpty(data.school)) {
    errors.school = 'School field is required';
  }
  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required';
  }
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of Study field is required';
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