import { body } from "express-validator";

export const blogPostValidation = [
  body("category").exists().withMessage("category is a mandatory field!"),
  body("title").exists().withMessage("title is a mandatory field!"),
  body("content").exists().withMessage("content has to be there!"),
];
