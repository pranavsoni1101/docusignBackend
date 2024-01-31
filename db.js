const mongoose = require('mongoose');

const MONGO_URI = process.env.DB_URI;

const connectToDb = () => {
    mongoose.connect(MONGO_URI)
      .then(() => {
        console.log('Connected to MongoDB using mongoose');
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB: ', error);
      });
}

module.exports = connectToDb;