import mongoose from 'mongoose';

const bookSchema = mongoose.Schema({
    name: String,
    author: String,
    price: Number,
    picture: String,
    year: Number,
    ISBN: String,
    description: String,
    link: String
});

export default mongoose.model('Book', bookSchema);