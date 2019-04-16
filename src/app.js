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

app.get("/infobstore", (req, res) => {
  const filepath = path.join(__dirname, "..", "openData", "catalog-b-store.xml");
  const file = fs.readFileSync(filepath, "utf-8");
  const data = parser.parse(file);
  res.send(data.yml_catalog.shop.offers.offer[0]);
});

app.get("/infobook24", (req, res) => {
  const filepath = path.join(__dirname, "..", "openData", "catalog-book24.xml");
  const file = fs.readFileSync(filepath, "utf-8");
  const data = parser.parse(file);
  res.send(data.yml_catalog.shop.offers.offer[0]);
});

app.get("/infocombook", (req, res) => {
  const filepath = path.join(__dirname, "..", "openData", "catalog-combook.xml");
  const file = fs.readFileSync(filepath, "utf-8");
  const data = parser.parse(file);
  res.send(data.yml_catalog.shop.offers.offer[0]);
});

app.post("/savebstore", (req, res) => {
    const filepath = path.join(__dirname, "..", "openData", "catalog-b-store.xml");
    const file = fs.readFileSync(filepath, "utf-8");
    const data = parser.parse(file);
    data.yml_catalog.shop.offers.offer.slice(1, 100).forEach(
      ({ name, author, price, picture, publisher, ISBN, description, url: link }) => {
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
            store : "Ливре. Книжная лавка"
          });
          book.save();
      }
    );
    res.status(201).json({message: "success"});
})

app.post("/savebook24", (req, res) => {
  const filepath = path.join(__dirname, "..", "openData", "catalog-book24.xml");
  const file = fs.readFileSync(filepath, "utf-8");
  const data = parser.parse(file);
  data.yml_catalog.shop.offers.offer.slice(1, 100).forEach(
    ({ name, author, price, image: picture, publisher, ISBN, description, url: link }) => {
        const book = new Book({
          name,
          author,
          price,
          picture,
          publisher,
          ISBN,
          description,
          link,
          store : "Книжный интернет-магазин Book24"
        });
        book.save();
    }
  );
  res.status(201).json({message: "success"});
})

app.post("/savecombook", (req, res) => {
  const filepath = path.join(__dirname, "..", "openData", "catalog-combook.xml");
  const file = fs.readFileSync(filepath, "utf-8");
  const data = parser.parse(file);
  data.yml_catalog.shop.offers.offer.slice(1, 100).forEach(
    ({ name, author, price, picture, publisher, ISBN, description, url: link }) => {
        const book = new Book({
          name,
          author,
          price,
          picture,
          publisher,
          ISBN,
          description,
          link,
          store : "Интернет-магазин КомБук"
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
