const validEmailRegex = RegExp(
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
);

const validPasswordRegex = RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

const validNameRegex = RegExp(/[ !@#$%^&*(),.?":{}|<>0-9]/i);

const validPhoneNoRegex = RegExp("^[0-9]{9}$");

const checkMinLength = (value, length) => value.length < length;

const checkMaxLength = (value, length) => value.length > length;

export const fromValidations = () => {};

export const isErrorObjectEmpty = (errors) => {
  let valid = true;
  Object.values(errors).forEach((val) => {
    if (val.length > 0) {
      valid = false;
    }
  });
  return valid;
};

/**
 * Validates provided form input 'value' according to the provided form input 'id'
 * @param {string} id form input id
 * @param {string} value form input value
 * @param {Object} _errors component state error object
 * @returns {Object} received errors object as-is or populated if there is an error
 */

export const validate = (id, value, _errors) => {
  let errors = _errors;
  // let errors = {};
  if (id === "fN" || id === "fN1" || id === "fN2") {
    if (validNameRegex.test(value)) {
      errors[id] = "Can not contain special characters or numbers";
    } else if (checkMinLength(value, 3)) {
      errors[id] = "At least 3 letters needed";
    } else if (checkMaxLength(value, 15)) {
      errors[id] = "Maximum number of characters allowed is 15";
    } else {
      errors[id] = "";
    }
  }

  if (id === "lN" || id === "lN1" || id === "lN2") {
    if (validNameRegex.test(value)) {
      errors[id] = "Can not contain special characters or numbers";
    } else if (checkMinLength(value, 3)) {
      errors[id] = "At least 3 letters needed";
    } else if (checkMaxLength(value, 15)) {
      errors[id] = "Maximum number of characters allowed is 15";
    } else {
      errors[id] = "";
    }
  }

  if (
    id === "email" ||
    id === "em" ||
    id === "eM" ||
    id === "eM1" ||
    id === "eM2"
  ) {
    if (checkMinLength(value, 1)) {
      errors[id] = "Email cannot be blank";
    } else if (!validEmailRegex.test(value)) {
      errors[id] = "Invalid Email";
    } else {
      errors[id] = "";
    }
  }

  //password for register
  if (id === "pwd" || id === "repwd") {
    if (checkMinLength(value, 1)) {
      errors[id] = "Please enter your password";
    } else if (checkMinLength(value, 8)) {
      errors[id] = "Password should be 8-30 characters long";
    } else if (checkMaxLength(value, 30)) {
      errors[id] = "Maximum number of characters allowed is 30";
    } else if (!validPasswordRegex.test(value)) {
      errors[id] =
        "Password should contain at least 1 uppercase letter, 1 lowercase letter, 1 numeric character and 1 special character";
    } else {
      errors[id] = "";
    }
  }

  //password for login
  if (id === "password") {
    if (checkMinLength(value, 1)) {
      errors[id] = "Please enter your password";
    } else if (checkMaxLength(value, 30)) {
      errors[id] = "Maximum number of characters allowed is 30";
    } else {
      errors[id] = "";
    }
  }

  // Position
  if (id === "pos") {
    if (checkMinLength(value, 3)) {
      errors[id] = "Field can not be blank";
    } else if (checkMaxLength(value, 30)) {
      errors[id] = "Maximum number of characters allowed is 30";
    } else {
      errors[id] = "";
    }
  }

  // Company name
  if (id === "cmp") {
    if (checkMinLength(value, 1)) {
      errors[id] = "Field can not be blank";
    } else if (checkMaxLength(value, 30)) {
      errors[id] = "Maximum number of characters allowed is 30";
    } else {
      errors[id] = "";
    }
  }

  // Address
  if (id === "adr") {
    if (checkMinLength(value, 1)) {
      errors[id] = "Field can not be blank";
    } else if (checkMaxLength(value, 30)) {
      errors[id] = "Maximum number of characters allowed is 30";
    } else {
      errors[id] = "";
    }
  }

  // personal phone number
  if (id === "pNo" || id === "pNo1" || id === "pNo2") {
    if (Number(value) === 0) {
      errors[id] = "Field can not be blank";
    } else if (!validPhoneNoRegex.test(value)) {
      errors[id] = "Field requires 9 digits";
    } else {
      errors[id] = "";
    }
  }

  // work phone number
  if (id === "wNo") {
    if (Number(value) === 0) {
      errors[id] = "Field can not be blank";
    } else if (!validPhoneNoRegex.test(value)) {
      errors[id] = "Field requires 9 digits";
    } else {
      errors[id] = "";
    }
  }
  // return error object
  return errors;
};
