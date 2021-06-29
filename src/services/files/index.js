/*
 1. POST /files/upload
 2. POST /files/uploadMultiple
*/

import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const cloudinaryStorageAvatars = new CloudinaryStorage({
  cloudinary, // grab CLOUDINARY_URL from process.env.CLOUDINARY_URL
  params: {
    folder: "authors",
  },
});

const cloudinaryStorageCovers = new CloudinaryStorage({
  cloudinary, // grab CLOUDINARY_URL from process.env.CLOUDINARY_URL
  params: {
    folder: "blog-post",
  },
});
const uploadAvatar = multer({ storage: cloudinaryStorageAvatars }).single(
  "avatar"
);
const uploadCover = multer({ storage: cloudinaryStorageCovers }).single(
  "cover"
);

// import createError from "http-errors";
import {
  getAuthors,
  writeAuthors,
  getPosts,
  writePosts,
  writeAuthorsPicture,
  writePostsPicture,
} from "../../lib/fs-tools.js";
// import { extname } from "path";

const filesRouter = express.Router();
// 1.

filesRouter.post(
  "/avatar/author/:id",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      // console.log(req.params.id);
      const authors = await getAuthors();
      const foundAuthorIndex = authors.findIndex(
        (user) => user._id === req.params.id
      );
      const url = `http://localhost:3001/img/authors/${req.file.originalname}`;
      if (foundAuthorIndex !== -1) {
        authors[foundAuthorIndex].avatar = url;
      }
      await writeAuthors(authors);
      await writeAuthorsPicture(req.file.originalname, req.file.buffer);
      res.send(url);
    } catch (error) {
      next(error);
    }
  }
);

// filesRouter.post(
//   "/blog/post/:id",
//   multer().single("cover"),
//   async (req, res, next) => {
//     try {
//       // console.log(req.params.id); does work
//       const posts = await getPosts();
//       const foundPostIndex = posts.findIndex(
//         (post) => post._id === req.params.id
//       );
//       // console.log(foundPostIndex); does work
//       const url = `http://localhost:3001/img/posts/${req.file.originalname}`;
//       if (foundPostIndex !== -1) {
//         posts[foundPostIndex].cover = url;
//         // console.log("foundPostIndex !== -1: true"); does work
//       }
//       await writePosts(posts);
//       await writePostsPicture(req.file.originalname, req.file.buffer);
//       res.send(url);
//     } catch (error) {
//       next(error);
//     }
//   }
// );

filesRouter.post("/blog/post/:id", uploadCover, async (req, res, next) => {
  try {
    console.log(req.file);
    const posts = await getPosts();
    const foundPostIndex = posts.findIndex(
      (post) => post._id === req.params.id
    );
    const url = req.file.path;
    if (foundPostIndex !== -1) {
      posts[foundPostIndex].cover = url;
      await writePosts(posts);
    }
    // const newCover = { cover: req.file.path };

    // save it in db

    res.send(posts[foundPostIndex]);
  } catch (error) {
    console.log(error);
  }
});

// 2.

// filesRouter.post(
//   "/uploadMultiple",
//   multer().array("avatar", 2),
//   async (req, res, next) => {
//     try {
//       console.log("REQ. FILE: ", req.file);
//       console.log("REQ. FILES: ", req.files);

//       const arrayOfPromises = req.files.map((file) =>
//         writeAuthorsPicture(file.originalname, file.buffer)
//       );

//       await Promise.all(arrayOfPromises);
//       res.send();
//     } catch (error) {
//       next(error);
//     }
//   }
// );

export default filesRouter;

/* FILES FILTER
{
    fileFilter: (req, file, multerNext) => {
      if (file.mimetype !== "image/gif") {
        return multerNext(createError(400, "Only GIF allowed!"));
      } else {
        return multerNext(null, true);
      }
    },
  }
*/
