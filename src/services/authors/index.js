import express from "express"; // 3rd party package
import { validationResult } from "express-validator";
import { authorValidation } from "./validation.js";
import createError from "http-errors";
import uniqid from "uniqid"; // 3rd party package
import { getAuthors, writeAuthors } from "../../lib/fs-tools.js";

const authorsRouter = express.Router();

// read all authors
authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors();
    res.send(authors);
  } catch (error) {
    next(error); // if I use next(error) inside a route handler I'm going to pass the error to the ERROR MIDDLEWARES
  }
});

// read single author
authorsRouter.get("/:id", async (req, res) => {
  const authors = await getAuthors();
  const author = authors.find((author) => author._id === req.params.id);
  res.send(author);
});

// create author
authorsRouter.post("/", authorValidation, async (req, res) => {
  try {
    const newAuthor = {
      name: req.body.name,
      surname: req.body.surname,
      _id: uniqid(),
      email: req.body.email,
      dateOfBirth: req.body.dateOfBirth,
      avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
    };
    // 2. read the content of the authors.json file
    const authors = await getAuthors();
    authors.push(newAuthor);
    // 4. save file (replace older content with the newer)
    await writeAuthors(authors);
    // 5. send proper response back
    res.status(201).send({ _id: newAuthor._id });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// PUT

authorsRouter.put("/:id", async (req, res) => {
  const authors = await getAuthors();
  const remainingAuthors = authors.filter((user) => user._id !== req.params.id);
  const foundAuthor = authors.find((user) => user._id === req.params.id);
  const modifiedAuthor = { ...foundAuthor, ...req.body, _id: req.params.id };
  remainingAuthors.push(modifiedAuthor);
  await writeAuthors(remainingAuthors);
  res.send(modifiedAuthor);
});

authorsRouter.delete("/:id", async (req, res) => {
  const authors = await getAuthors();
  const remainingAuthors = authors.filter(
    (author) => author._id !== req.params.id
  );
  await writeAuthors(remainingAuthors);
  res.status(200).send(`user with id of ${req.params.id} has been deleted`);
});

export default authorsRouter;
