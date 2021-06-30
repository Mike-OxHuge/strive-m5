import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;
export const getCurrentFolderPath = (currentFile) =>
  dirname(fileURLToPath(currentFile));
const dataFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../services/posts"
);

/* ---- AUTHORS ---- */
const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../services/authors/authors.json"
);
const authorsPublicFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/authors"
);
export const getAuthors = () => readJSON(authorsJSONPath);
export const writeAuthors = (content) => writeJSON(authorsJSONPath, content);
export const writeAuthorsPicture = (fileName, content) =>
  writeFile(join(authorsPublicFolderPath, fileName), content);

/* ---- POSTS ---- */

const postsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../services/posts/posts.json"
);
const postsPublicFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/posts"
);
export const getPosts = () => readJSON(postsJSONPath);
export const writePosts = (content) => writeJSON(postsJSONPath, content);
export const writePostsPicture = (fileName, content) =>
  writeFile(join(postsPublicFolderPath, fileName), content);

export const getPostsReadableStream = () =>
  createReadStream(join(dataFolderPath, "posts.json"));
