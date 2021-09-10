import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
  name: String,
  author: String,
  price: Number,
  picture: String,
  publisher: String,
  ISBN: String,
  description: String,
  link: String,
  store: String,
});

export default mongoose.model('Book', bookSchema);
