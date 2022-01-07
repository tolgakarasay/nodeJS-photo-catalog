// Express sayesinde HTTP metodlarını kolaylıkla kullanabiliriz.
const express = require('express');
const app = express();

// path modülünü import edelim. Path bir core modül olduğu için download gerekmeden çağırınca gelir.
const path = require('path');

// ejs modülünü import edelim
const ejs = require('ejs');

// Photo modülünü import edelim
const Photo = require('./models/Photo');

// mongoose modülünü import edelim
const mongoose = require('mongoose');

// connect DB
mongoose.connect('mongodb://localhost/pcat-test-db');

// TEMPLATE ENGINE
app.set('view engine', 'ejs');

const myLogger = (req, res, next) => {
  console.log('Middleware log 1');
  // next() yazalım ki bir sonraki middleware e ilerleyebilsin. Sayfa yüklenmesi yarıda kalmasın.
  next();
};

const myLogger2 = (req, res, next) => {
  console.log('Middleware log 2');
  next();
};

// MIDDLEWARE'ler

// To serve static files such as images, CSS files, and JavaScript files,
// use the express.static built-in middleware function in Express.
app.use(express.static('public'));
app.use(myLogger);
app.use(myLogger2);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// get request de aslında bir middleware'dir.
app.get('/', async (req, res) => {
  const photos = await Photo.find({});
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('index', {
    photos,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

// Sunucuyu başlatalım
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});

// not: request ve response arasında bulunan herşey middleware'dir. Routing bile middleware'dir.

// photo yükleme yönlendirmesi (routing)
app.post('/photos', async (req, res) => {
  await Photo.create(req.body);
  console.log(req.body);
  res.redirect('/');
});
