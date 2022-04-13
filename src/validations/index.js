const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const isValidMobile = (mobile) => {
  return String(mobile).match(/^\d{10}$/);
}

export const validate = (group, name, value, deps = {}) => {

  if (group == "personal") {
    switch (name) {
      case "firstName": {
        return value ? null : "This field is required";
      }
      case "email": {
        if (!value) return "This field is required";
        if (!isValidEmail(value)) return "Please enter valid email address";
        return null;
      }
      case "mobile": {
        if (!value) return "This field is required";
        if (!isValidMobile(value)) return "Please enter valid mobile number";
        return null;
      }
      case "city": {
        return value ? null : "This field is required";
      }
      default: return null;
    }
  }

  else if (group == "education") {
    switch (name) {
      case "college":
      case "degree":
      case "stream":
      case "startYear": return value ? null : "This field is required";
      case "endYear": {
        if (!value) return "This field is required";
        if (value < deps.startYear) return "End year should be more than start year";
        return null;
      }

      case "performance": {
        if (deps.performanceScale == "percentage") {
          return (!value || (0 <= value && value <= 100)) ? null : "Please enter the value in the range 0 to 100";
        }
        else {
          return (!value || (0 <= value && value <= 10)) ? null : "Please enter the value in the range 0 to 10";
        }
      }
      default: return null;
    }
  }
  else if (group == "job") {
    switch (name) {
      case "profile": {
        return value ? null : "This field is required";
      }
      case "organization": {
        return value ? null : "This field is required";
      }
      case "location": {
        return (deps.workFromHome == true || value) ? null : "This field is required";
      }
      case "startDate": {
        return value ? null : "Please enter a valid date";
      }
      case "endDate": {
        return (deps.currentlyWorkingHere == true || value) ? null : "Please enter a valid date";
      }
    }
  }

  else {
    return null;
  }

}


const validateManyFields = (group, list) => {
  const errors = [];
  for (const field in list) {
    const err = validate(group, field, list[field], list);
    if (err) errors.push({ field, err });
  }
  return errors;
}
export default validateManyFields;