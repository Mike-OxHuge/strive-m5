/*
 1. POST /files/upload
 2. POST /files/uploadMultiple
*/

import express from "express";
import multer from "multer";
import createError from "http-errors";
import { writeAuthorsPicture } from "../../lib/fs-tools.js";

const filesRouter = express.Router();

// 1.

filesRouter.post(
  "/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      console.log(req.file);

      await writeAuthorsPicture(req.file.originalname, req.file.buffer);
      res.send("Img uploaded!");
    } catch (error) {
      next(error);
    }
  }
);

// 2.

filesRouter.post(
  "/uploadMultiple",
  multer().array("avatar", 2),
  async (req, res, next) => {
    try {
      console.log("REQ. FILE: ", req.file);
      console.log("REQ. FILES: ", req.files);

      const arrayOfPromises = req.files.map((file) =>
        writeAuthorsPicture(file.originalname, file.buffer)
      );

      await Promise.all(arrayOfPromises);
      res.send();
    } catch (error) {
      next(error);
    }
  }
);

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
