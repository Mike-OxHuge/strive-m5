import { body } from "express-validator";

export const authorValidation = [
  body("name").exists().withMessage("name is a mandatory field!"),
  body("surname").exists().withMessage("surname is a mandatory field!"),
  body("email")
    .exists()
    .withMessage("email has to be there!")
    .isEmail()
    .withMessage("invalid email"),
];
