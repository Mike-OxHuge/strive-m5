import PdfPrinter from "pdfmake";
import { dirname, join } from "path"; // core package
import { fileURLToPath } from "url"; // core package
import fs from "fs"; // core package
import striptags from "striptags";
import * as http from "https";

const postsJSONpath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../services/posts/posts.json"
);

const getPostsArray = () => {
  const content = fs.readFileSync(postsJSONpath);
  return JSON.parse(content);
};

const singlePost = () => {
  const posts = getPostsArray();
  let foundPost;
  foundPost = posts.find((post) => post._id === 1);
  return foundPost;
};

const foundPost = singlePost();

export const generatePDFReadableStream = (data) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-Oblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  // import http from "http";
  // var http = require("http");

  const url = async () => {
    http
      .get(`${foundPost.cover}`, async (resp) => {
        resp.setEncoding("base64");
        resp.body = "data:" + resp.headers["content-type"] + ";base64,";
        resp.on("data", (data) => {
          resp.body += data;
        });
        resp.on("end", () => {
          const basebase = resp.body;
          console.log(basebase);
          return basebase;
          // return resp.json({ result: resp.body, status: "success" });
        });
      })
      .on("error", (e) => {
        console.log(`Got error: ${e.message}`);
      });
  };
  let imageBase64 = url();

  const docDefinition = {
    content: [
      `image path is: ${foundPost.cover}, I also tried to encode it and I got ${imageBase64}`,
      `${foundPost.title}`,
      `${striptags(foundPost.content)}`,
    ],
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();
  return pdfReadableStream;
};
