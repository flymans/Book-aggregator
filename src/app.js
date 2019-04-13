/*eslint-disable no-console*/

import fs from "fs";
import url from "url";
import path from "path";
import parser from "fast-xml-parser";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "./models/book";

dotenv.config();

const app = express();

app.get("/", (req, res) => {
  Book.find().then(books => res.json(books));
});

app.post("/save", (req, res) => {
    const filepath = path.join(__dirname, "..", "openData", "yamarket.xml");
    const file = fs.readFileSync(filepath, "utf-8");
    const data = parser.parse(file);
    data.yml_catalog.shop.offers.offer.slice(0,10000).forEach(
      ({ name, author, price, picture, year, ISBN, description, url: link }) => {
          const book = new Book({
            name,
            author,
            price,
            picture: url.format({
              ...url.parse(picture),
              host: "b-stock.ru"
            }),
            year,
            ISBN,
            description,
            link
          });
          book.save();
      }
    );
    res.status(201).json({message: "success"});
})

const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port);
    console.log(process.env.NODE_ENV, `server started on port ${port}.`);
  })
  .catch(err => console.log(err));
