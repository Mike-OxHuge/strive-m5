import express from "express"; // 3rd party package
import fs from "fs"; // core package
import { fileURLToPath } from "url"; // core package
import { dirname, join } from "path"; // core package
import uniqid from "uniqid"; // 3rd party package

const postsRouter = express.Router();

const filePath = fileURLToPath(import.meta.url);
const folderPath = dirname(filePath);
const postsJSONpath = join(folderPath, "posts.json");

// read authors
postsRouter.get("/", (req, res) => {
  // 1. Read users.json file obtaining an array
  const postsJSONcontent = fs.readFileSync(postsJSONpath); // we get back a BUFFER which is MACHINE READABLE
  const contentAssJSON = JSON.parse(postsJSONcontent); // We need to convert the content into something HUMAN READABLE (JSON)
  // 2. Send the content as a response
  res.send(contentAssJSON);
});

export default postsRouter;
