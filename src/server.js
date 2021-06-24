import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";

import postsRouter from "./services/posts/index.js";
import authorsRouter from "./services/authors/index.js";
import filesRouter from "./services/files/index.js";

import { getCurrentFolderPath } from "./lib/fs-tools.js";

const server = express();
const port = 3001;

const publicFolderPath = join(
  getCurrentFolderPath(import.meta.url),
  "../public"
);

server.use(express.static(publicFolderPath));
server.use(cors());
server.use(express.json());
server.use("/", postsRouter);
server.use("/authors", authorsRouter);
server.use("/files", filesRouter);

console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server is running on port " + port);
});
