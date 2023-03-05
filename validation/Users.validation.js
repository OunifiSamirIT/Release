const isEmpty = require("./isEmpty");
const validator = require("validator");

module.exports = function ValidateUser(data) {
  let errors = {};
  data.Notes = !isEmpty(data.Notes) ? data.Notes : "";
  data.Date = !isEmpty(data.Date) ? data.Date : "";
  data.Testeur = !isEmpty(data.Testeur) ? data.Testeur : "";
  data.Version = !isEmpty(data.Version) ? data.Version : "";
 
 
  if (validator.isEmpty(data.Notes)) {
    errors.Notes = "Required Notes";
  }
  if (validator.isEmpty(data.Date)) {
    errors.Date = "Required Date";
  }
  if (validator.isEmpty(data.Testeur)) {
    errors.Testeur = "Required Testeur";
  }
  if (validator.isEmpty(data.Version)) {
    errors.Version = "Required Version";
  }

  return {
      errors,
      isValid: isEmpty(errors)
  }
};
