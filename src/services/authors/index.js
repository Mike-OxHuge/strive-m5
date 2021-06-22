import express from "express"; // 3rd party package
import fs from "fs"; // core package
import { fileURLToPath } from "url"; // core package
import { dirname, join } from "path"; // core package
import uniqid from "uniqid"; // 3rd party package

const authorsRouter = express.Router();

const filePath = fileURLToPath(import.meta.url);
const folderPath = dirname(filePath);
const authorsJSONpath = join(folderPath, "authors.json");

authorsRouter.get("/", (req, res) => {
  // 1. Read users.json file obtaining an array
  const authorsJSONcontent = fs.readFileSync(authorsJSONpath); // we get back a BUFFER which is MACHINE READABLE
  const authors = JSON.parse(authorsJSONcontent); // We need to convert the content into something HUMAN READABLE (JSON)
  // 2. Send the content as a response
  res.send(authors);
});

// create author
authorsRouter.post("/", (req, res) => {
  const newAuthor = {
    name: req.body.name,
    surname: req.body.surname,
    _id: uniqid(),
    email: req.body.email,
    dateOfBirth: req.body.dateOfBirth,
    avatar: `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`,
  };

  // 2. read the content of the authors.json file

  const authors = JSON.parse(fs.readFileSync(authorsJSONpath));
  const extra = authors.find((author) => author.email !== req.body.email);

  // a bit of validation
  if (
    req.body.name !== undefined &&
    req.body.surname !== undefined &&
    req.body.email !== undefined &&
    req.body.dateOfBirth !== undefined &&
    extra !== undefined
  ) {
    // 3. add new user to the array

    authors.push(newAuthor);

    // 4. save file (replace older content with the newer)

    fs.writeFileSync(authorsJSONpath, JSON.stringify(authors));

    // 5. send proper response back
    res.status(201).send({ _id: newAuthor._id });
  } else {
    res
      .status(400)
      .send(
        "some fields are missing or there's a typo or there's already user with this email"
      );
  }
});

// read single author
authorsRouter.get("/:id", (req, res) => {
  // 1. Read users.json file obtaining an array
  const authors = JSON.parse(fs.readFileSync(authorsJSONpath));

  // 2. Find the user which have the specified id
  const author = authors.find((author) => author._id === req.params.id);

  // 3. Send it as a response

  res.send(author);
});

// PUT is pretty much fucked
// update author
// authorsRouter.put("/:id", (req, res) => {
//   const authors = JSON.parse(fs.readFileSync(authorsJSONpath));
//   const remainingUsers = authors.filter(
//     (author) => author._id !== req.params.id
//   );
//   const foundUser = authors.find((user) => user._id === req.params.id);
//   console.log(foundUser);
//   const modifiedUser = {
//     ...req.body,
//     _id: req.params.id,
//   };
//   remainingUsers.push(modifiedUser);
//   fs.writeFileSync(authorsJSONpath, JSON.stringify(remainingUsers));
//   res.send(modifiedUser);
// });

authorsRouter.put("/:id", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONpath));
  const remainingUsers = authors.filter((user) => user._id !== req.params.id);
  const foundUser = authors.find((user) => user._id === req.params.id);
  const modifiedUser = { ...foundUser, ...req.body, _id: req.params.id };
  remainingUsers.push(modifiedUser);
  fs.writeFileSync(authorsJSONpath, JSON.stringify(remainingUsers));
  res.send(modifiedUser);
});

authorsRouter.delete("/:id", (req, res) => {
  // 1. Read users.json file obtaining an array
  const authors = JSON.parse(fs.readFileSync(authorsJSONpath));

  // 2. Filter out the specified id

  const remainingUsers = authors.filter(
    (author) => author._id !== req.params.id
  );

  // 3. Save the new content (remainingUsers) on users.json file back

  fs.writeFileSync(authorsJSONpath, JSON.stringify(remainingUsers));

  // 4. Send a proper response
  res.status(204).send(`user with id of ${req.params.id} has been deleted`);
});

export default authorsRouter;

/*
Authors should have following information:
    name
    surname
    ID (Unique and server generated)
    email
    date of birth
    avatar (e.g. https://ui-avatars.com/api/?name=John+Doe)
*/
