import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const authorsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../services/authors/authors.json"
);
// const booksJSONPath = join(
//   dirname(fileURLToPath(import.meta.url)),
//   "../data/books.json"
// );
const authorsPublicFolderPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/authors"
);

export const getAuthors = () => readJSON(authorsJSONPath);
// export const getBooks = () => readJSON(booksJSONPath);

export const writeAuthors = (content) => writeJSON(authorsJSONPath, content);
// export const writeBooks = (content) => writeJSON(booksJSONPath, content);

export const getCurrentFolderPath = (currentFile) =>
  dirname(fileURLToPath(currentFile));

export const writeAuthorsPicture = (fileName, content) =>
  writeFile(join(authorsPublicFolderPath, fileName), content);
