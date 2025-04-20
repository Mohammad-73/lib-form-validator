class Validator {
  constructor() {}

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

  validateInput(inputElement, rules, customMessage, customStyles) {}
}

let validator1 = new Validator();

validator1.getValidation("username", ["required", "minLength:3"]);
