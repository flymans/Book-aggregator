/*eslint-disable no-console*/

import fs from "fs";
import url from "url";
import path from "path";
import parser from "fast-xml-parser";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import _ from "lodash";

import Book from "./models/book";

dotenv.config();

const app = express();
//enable CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//API
app.get("/books", (req, res) => {
  const { name, author, publisher, page = 1, perPage = 50 } = req.query;

  const params = Object.entries({ name, author, publisher }).reduce(
    (acc, [key, value]) =>
      value ? { ...acc, [key]: new RegExp(value, "gi") } : acc,
    {}
  );

  Book.find(params, null, { skip: (page - 1) * perPage, limit: perPage }).then(
    books => res.json(books)
  );
});

app.get("/authors", (req, res) => {
  const { page = 1, perPage = 50 } = req.query;

  Book.find(null, null, { skip: (page - 1) * perPage, limit: perPage }).then(
    books =>
      res.json(_.uniq(_.flatten(books.filter(book => book.author).map(book => book.author.split(', ')))))
  );
});

app.get("/publishers", (req, res) => {
  const { page = 1, perPage = 50 } = req.query;

  Book.find(null, null, { skip: (page - 1) * perPage, limit: perPage }).then(
    books =>
      res.json(_.uniq(books.filter(book => book.publisher).map(book => book.publisher)))
  );
});
//save data to database
app.post("/savebstore", (req, res) => {
  const filepath = path.join(
    __dirname,
    "..",
    "openData",
    "catalog-b-store.xml"
  );
  const file = fs.readFileSync(filepath, "utf-8");
  const data = parser.parse(file);
  data.yml_catalog.shop.offers.offer.forEach(
    ({
      name,
      author,
      price,
      picture,
      publisher,
      ISBN,
      description,
      url: link
    }) => {
      const book = new Book({
        name,
        author,
        price,
        picture: url.format({
          ...url.parse(picture),
          host: "b-stock.ru"
        }),
        publisher,
        ISBN,
        description,
        link,
        store: "Ливре. Книжная лавка"
      });
      book.save();
    }
  );
  res.status(201).json({ message: "success" });
});

app.post("/savebook24", (req, res) => {
  const filepath = path.join(__dirname, "..", "openData", "catalog-book24.xml");
  const file = fs.readFileSync(filepath, "utf-8");
  const data = parser.parse(file);
  data.yml_catalog.shop.offers.offer.forEach(
    ({
      name,
      author,
      price,
      image: picture,
      publisher,
      ISBN,
      description,
      url: link
    }) => {
      const book = new Book({
        name,
        author,
        price,
        picture,
        publisher,
        ISBN,
        description,
        link,
        store: "Книжный интернет-магазин Book24"
      });
      book.save();
    }
  );
  res.status(201).json({ message: "success" });
});

app.post("/savecombook", (req, res) => {
  const filepath = path.join(
    __dirname,
    "..",
    "openData",
    "catalog-combook.xml"
  );
  const file = fs.readFileSync(filepath, "utf-8");
  const data = parser.parse(file);
  data.yml_catalog.shop.offers.offer.forEach(
    ({
      name,
      author,
      price,
      picture,
      publisher,
      ISBN,
      description,
      url: link
    }) => {
      const book = new Book({
        name,
        author,
        price,
        picture,
        publisher,
        ISBN,
        description,
        link,
        store: "Интернет-магазин КомБук"
      });
      book.save();
    }
  );
  res.status(201).json({ message: "success" });
});

const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(port);
    console.log(process.env.NODE_ENV, `server started on port ${port}.`);
  })
  .catch(err => console.log(err));
