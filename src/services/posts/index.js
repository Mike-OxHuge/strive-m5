import express from "express"; // 3rd party package
import fs from "fs"; // core package
import { fileURLToPath } from "url"; // core package
import { dirname, join } from "path"; // core package
import uniqid from "uniqid"; // 3rd party package
import { nextTick } from "process";

const postsRouter = express.Router();
const postsJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "posts.json"
);
const getPostsArray = () => {
  const content = fs.readFileSync(postsJSONpath);
  return JSON.parse(content);
};

// read posts
postsRouter.get("/", (req, res) => {
  try {
    const posts = getPostsArray();
    res.send(posts);
  } catch (error) {
    next(error); // currently no middleware
  }
});

// read single post
postsRouter.get("/blog/:postId", (req, res) => {
  try {
    const posts = getPostsArray();
    const post = posts.find((p) => p._id === parseInt(req.params.postId));
    if (post) {
      console.log(post);
      res.send(post);
    } else {
      res.status(404).send(`post with id ${req.params.postId} not found`);
    }
  } catch (error) {
    next(error); // currently no middleware
  }
});
export default postsRouter;
