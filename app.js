//__________________________________________
//__________________MODULES_________________
const express = require('express');
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const Photo = require('./models/Photo');

const app = express();

//__________________________________________
//______________DB CONNECTION_______________
mongoose.connect('mongodb://localhost/pcat-test-db');

//__________________________________________
//____________TEMPLATE ENGINE_______________
app.set('view engine', 'ejs');

//__________________________________________
//_______________MIDDLEWARES________________
// To serve static files such as images, CSS files, and JavaScript files,
// use the express.static built-in middleware function in Express.
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileupload());

//__________________________________________
//__________________ROUTES__________________
// get request de aslında bir middleware'dir.
// not: request ve response arasında bulunan herşey middleware'dir. Routing bile middleware'dir.

app.get('/', async (req, res) => {
  const photos = await Photo.find({}).sort('-dateCreated');
  //res.sendFile(path.resolve(__dirname, 'temp/index.html'));
  res.render('index', {
    photos,
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  res.render('photo', {
    photo,
  });
});

// photo yükleme yönlendirmesi (routing)
app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
  });
  res.redirect('/');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

//__________________________________________
//____________START THE SERVER______________
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
