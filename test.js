const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connect DB
mongoose.connect('mongodb://localhost/pcat-test-db');

// create schema
const photoSchema = new Schema({
  title: String,
  description: String,
});

// Bu şablonu baz alarak modelimizi oluşturucaz.
// Modelimiz veritabanımızdaki collection ve dokumanımızı oluşturacak.

const Photo = mongoose.model('Photo', photoSchema);

// create a photo
/*

Photo.create({
  title: 'Photo title 2 created in VS Code',
  description: 'Description 2 lorem ipsum created in VS Code',
});

*/

/*

//read a photo
Photo.find({}, (err, data) => {
  console.log(data);
});

// update a photo
const id = '61d781238e8a8c0a37f23449';
Photo.findByIdAndUpdate(
  id,
  {
    title: 'Photo2 updated',
    description: 'Photo 2 description updated',
  },
  (err, data) => {
    console.log(data);
  }
);

*/

const id = '61d842b61fa906ae20c47590';

Photo.findByIdAndDelete(id, (err, data) => {
  console.log('photo has been removed');
});
