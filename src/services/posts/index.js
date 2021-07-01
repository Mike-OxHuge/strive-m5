import express from "express"; // 3rd party package
import fs from "fs"; // core package
import { fileURLToPath } from "url"; // core package
import { dirname, join } from "path"; // core package
import uniqid from "uniqid"; // 3rd party package
import { validationResult } from "express-validator";
import { blogPostValidation } from "./validation.js";
import { pipeline } from "stream";
import { generatePDFReadableStream } from "../../lib/pdf/index.js";
import { getPostsReadableStream, getAuthors } from "../../lib/fs-tools.js";
import { sendEmail } from "../../lib/email/index.js";

const postsRouter = express.Router();
const postsJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "posts.json"
);
const getPostsArray = () => {
  const content = fs.readFileSync(postsJSONpath);
  return JSON.parse(content);
};
const writePosts = (content) =>
  fs.writeFileSync(postsJSONpath, JSON.stringify(content));

// read posts
postsRouter.get("/", (req, res, next) => {
  try {
    const posts = getPostsArray();
    res.send(posts);
  } catch (error) {
    next(error); // currently no middleware
  }
});

// read single post
postsRouter.get("/blog/:postId", (req, res, next) => {
  try {
    const posts = getPostsArray();
    const post = posts.find((p) => p._id == req.params.postId);
    if (post) {
      res.send(post);
    } else {
      res.status(404).send(`post with id ${req.params.postId} not found`);
    }
  } catch (error) {
    next(error); // currently no middleware
  }
});

postsRouter.post("/", blogPostValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req); // VALIDATION RESULT GIVES BACK A LIST OF ERRORS COMING FROM THE usersValidation MIDDLEWARE

    if (errors.isEmpty()) {
      const newPost = { ...req.body, _id: uniqid(), createdAt: new Date() };
      const authors = await getAuthors();
      const posts = getPostsArray();
      const foundAuthor = authors.find(
        (author) => author.name === req.body.author.name
      );
      posts.push(newPost);
      writePosts(posts);
      sendEmail(foundAuthor.email);
      console.log(foundAuthor.email);
      res.status(201).send({ _id: newPost._id });
    } else {
      // I HAD VALIDATION ERRORS
      next(createError(400, { errorsList: errors }));
    }
  } catch (error) {
    next(error); // currently no middleware
  }
});

// delete one
postsRouter.delete("/blog/:postId", (req, res, next) => {
  try {
    const posts = getPostsArray();
    const remainingPosts = posts.filter(
      (post) => post._id !== req.params.postId
    );
    writePosts(remainingPosts);
    res.status(200).send(`post with ${req.params.postId} has been deleted`);
  } catch (error) {
    next(error); // currently no middleware
  }
});

// update post
postsRouter.put("/blog/:postId", (req, res, next) => {
  try {
    const posts = getPostsArray();

    const remainingPosts = posts.filter(
      (post) => post._id !== req.params.postId
    );
    const foundPost = posts.find((post) => post._id === req.params.postId);
    const updatedPost = { ...foundPost, ...req.body, _id: req.params.postId };

    remainingPosts.push(updatedPost);

    writePosts(remainingPosts);

    res.send(updatedPost);
  } catch (error) {
    next(error);
  }
});

postsRouter.get("/JSONDownload", async (req, res, next) => {
  try {
    // SOURCE (books.json) --> DESTINATION (response)

    res.setHeader("Content-Disposition", "attachment; filename=posts.json"); // this header is needed to tell the browser to open the "Save file as " dialog
    const source = getPostsReadableStream();
    // console.log(source)
    const destination = res;

    pipeline(source, destination, (err) => {
      if (err) next(err);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

postsRouter.get("/PDFDownload", async (req, res, next) => {
  try {
    // SOURCE (books.json) --> DESTINATION (response)

    res.setHeader("Content-Disposition", "attachment; filename=post.pdf"); // this header is needed to tell the browser to open the "Save file as " dialog
    const source = generatePDFReadableStream();
    // console.log(source)
    const destination = res;

    pipeline(source, destination, (err) => {
      if (err) next(err);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default postsRouter;
