// ../utils/actions/formActions.js
import {
  validateString,
  validateEmail,
  validatePassword,
  validateNumber,
  validateCreditCardNumber,
  validateExpiryDate,
  validateCVV,
} from "../ValidationConstraints";

export const validateInput = (inputId: string, inputValue: string) => {
  if (inputId === "mobile") {
    const isValid = /^\d{10}$/.test(inputValue);
    return isValid ? null : "Enter a valid 10 digit mobile number";
  }

  if (inputId === "aadharNumber") {
    const isValid = /^\d{12}$/.test(inputValue);
    return isValid ? null : "Enter a valid valid aadhar number";
  }

  if (
    inputId === "fullName" ||
    inputId === "firstName" ||
    inputId === "lastName" ||
    inputId === "location" ||
    inputId === "phoneNumber" ||
    inputId === "bio" ||
    inputId === "address" ||
    inputId === "street" ||
    inputId === "postalCode" ||
    inputId === "appartment" ||
    inputId === "destination" ||
    inputId === "ageRange" ||
    inputId === "description" ||
    inputId === "about" ||
    inputId === "creditCardHolderName" ||
    inputId === "addressLine1" ||
    inputId === "addressLine2" ||
    inputId === "aadharNumber"
  ) {
    return validateString(inputId, inputValue);
  } else if (
    inputId === "email" ||
    inputId === "currentEmail" ||
    inputId === "newEmail"
  ) {
    return validateEmail(inputId, inputValue);
  } else if (
    inputId === "password" ||
    inputId === "confirmPassword" ||
    inputId === "currentPassword" ||
    inputId === "newPassword" ||
    inputId === "confirmNewPassword"
  ) {
    return validatePassword(inputId, inputValue);
  } else if (inputId === "resetToken") {
    return validateString(inputId, inputValue);
  } else if (inputId === "places") {
    return validateNumber(inputId, inputValue);
  } else if (inputId === "creditCardNumber") {
    return validateCreditCardNumber(inputId, inputValue);
  } else if (inputId === "creditCardExpiryDate") {
    return validateExpiryDate(inputId, inputValue);
  } else if (inputId === "cvv") {
    return validateCVV(inputId, inputValue);
  }

  // Return null for unknown inputId to avoid undefined
  return null;
};
