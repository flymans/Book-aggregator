import _ from 'lodash';
import fs from 'fs';
import url from 'url';
import path from 'path';
import parser from 'fast-xml-parser';

import Book from '../models/books';

const getBooks = (req, res) => {
  const { name, author, publisher, page = 1, perPage = 50 } = req.query;
  const limit = Number(perPage);

  const params = Object.entries({ name, author, publisher }).reduce(
    (acc, [key, value]) =>
      value ? { ...acc, [key]: new RegExp(value, 'gi') } : acc,
    {}
  );

  Book.find(params, null, { skip: (page - 1) * limit, limit }).then((books) => {
    Book.where(params).count((err, count) =>
      res.json({ data: books, meta: { total: count } })
    );
  });
};

const getAuthors = (req, res) => {
  const { page = 1, perPage = 50 } = req.query;
  const limit = Number(perPage);

  Book.find(null, null, { skip: (page - 1) * limit, limit }).then((books) =>
    res.json(
      _.uniq(
        _.flatten(
          books
            .filter((book) => book.author)
            .map((book) => book.author.split(', '))
        )
      )
    )
  );
};

const getPublishers = (req, res) => {
  const { page = 1, perPage = 50 } = req.query;
  const limit = Number(perPage);

  Book.find(null, null, { skip: (page - 1) * limit, limit }).then((books) =>
    res.json(
      _.uniq(
        books.filter((book) => book.publisher).map((book) => book.publisher)
      )
    )
  );
};
// save data to database
const saveBStore = (req, res) => {
  const filepath = path.join(
    __dirname,
    '..',
    'openData',
    'catalog-b-store.xml'
  );
  const file = fs.readFileSync(filepath, 'utf-8');
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
      url: link,
    }) => {
      const book = new Book({
        name,
        author,
        price,
        picture: url.format({
          ...url.parse(picture),
          host: 'b-stock.ru',
        }),
        publisher,
        ISBN,
        description,
        link,
        store: 'Ливре. Книжная лавка',
      });
      book.save();
    }
  );
  res.status(201).json({ message: 'success' });
};

const saveBook24 = (req, res) => {
  const filepath = path.join(__dirname, '..', 'openData', 'catalog-book24.xml');
  const file = fs.readFileSync(filepath, 'utf-8');
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
      url: link,
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
        store: 'Книжный интернет-магазин Book24',
      });
      book.save();
    }
  );
  res.status(201).json({ message: 'success' });
};

const saveComBook = (req, res) => {
  const filepath = path.join(
    __dirname,
    '..',
    'openData',
    'catalog-combook.xml'
  );
  const file = fs.readFileSync(filepath, 'utf-8');
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
      url: link,
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
        store: 'Интернет-магазин КомБук',
      });
      book.save();
    }
  );
  res.status(201).json({ message: 'success' });
};

export {
  getBooks,
  getAuthors,
  getPublishers,
  saveBStore,
  saveBook24,
  saveComBook,
};
