class Validator {
  constructor() {
    this.errors = {};
  }

  getValidation(inputId, rules, customMessage = {}, customStyles = {}) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
      console.log(`Element with id ${inputId} not found`);
      return;
    }

    inputElement.addEventListener("input", (e) => {
      this.validateInput(inputElement, rules, customMessage, customStyles);
    });

    this.validateInput(inputElement, rules, customMessage, customStyles);
  }

  validateInput(inputElement, rules, customMessage, customStyles) {
    const value = inputElement.value;
    this.errors[inputElement.id] = [];
    for (const rule of rules) {
      const [ruleName, params] = rule.split(":");
      const validationMethod = this[ruleName];

      if (validationMethod && !validationMethod.call(this, value, params)) {
        this.errors[inputElement.id].push(
          this.getErrorMessage(ruleName, customMessage, params)
        );
      }
    }
    this.showErrors(inputElement, customStyles);
  }

  required(value) {
    return value !== "";
  }

  email(value) {
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailPattern.test(value);
  }

  minLength(value, length) {
    return value.length >= length;
  }

  maxLength(value, length) {
    return value.length <= length;
  }

  pattern(value, regex) {
    const pattern = new RegExp(regex);
    return pattern.test(value);
  }

  getErrorMessage(ruleName, customMessage, params) {
    const defaultMessages = {
      required: "This field is required!",
      minLength: `Min length limit is ${params}`,
      maxLength: `Max length limit is ${params}`,
      email: "Email is not valid",
      pattern: "Value is not valid",
    };
    return customMessage[ruleName] || defaultMessages[ruleName];
  }

  showErrors(inputElement, customStyles) {
    let errorContainer = inputElement.nextElementSibling;
    if (!errorContainer) errorContainer = document.createElement("div");
    errorContainer.classList.add("error_message");
    inputElement.parentNode.insertBefore(
      errorContainer,
      inputElement.nextSibling
    );

    errorContainer.innerHTML = this.errors[inputElement.id].join("<br>");
    Object.assign(errorContainer.style, customStyles);
  }

  validateForm(inputIds) {
    let isValid = true;
    for (let inputId of inputIds) {
      if (this.errors[inputId] && this.errors[inputId].length > 0) {
        isValid = false;
      }
    }
    return isValid;
  }
}

let validator1 = new Validator();

validator1.getValidation("username", [
  "required",
  "minLength:3",
  "maxLength:5",
]);
validator1.getValidation(
  "first_name",
  ["required", "pattern:^[A-Za-z][A-Za-z-z0-9_]{7,29}$"],
  {
    pattern: "Username should contain letter, number and underscore.",
  }
);
validator1.getValidation("email", ["required", "email"]);

let my_form = document.getElementById("my_form");

my_form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validator1.validateForm(["username", "first_name", "email"])) {
    console.log("Not valid form");
  } else {
    console.log("Form is valid");
  }
});
