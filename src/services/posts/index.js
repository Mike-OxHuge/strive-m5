import express from "express"; // 3rd party package
import fs from "fs"; // core package
import { fileURLToPath } from "url"; // core package
import { dirname, join } from "path"; // core package
import uniqid from "uniqid"; // 3rd party package
import { validationResult } from "express-validator";
import { blogPostValidation } from "./validation.js";

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

postsRouter.post("/", blogPostValidation, (req, res, next) => {
  try {
    const errors = validationResult(req); // VALIDATION RESULT GIVES BACK A LIST OF ERRORS COMING FROM THE usersValidation MIDDLEWARE

    if (errors.isEmpty()) {
      const newPost = { ...req.body, _id: uniqid(), createdAt: new Date() };

      const posts = getPostsArray();

      posts.push(newPost);

      writePosts(posts);
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
    next(error);
  }
});

/*
usersRouter.delete("/:userId", (req, res, next) => {
  try {
    const users = getUsersArray()
    const remainingUsers = users.filter(user => user._id !== req.params.userId)

    writeUsers(remainingUsers)

    res.status(200).send("Deleted!")
  } catch (error) {
    next(error)
  }
})
*/
export default postsRouter;
