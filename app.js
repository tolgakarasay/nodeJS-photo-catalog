//__________________________________________
//__________________MODULES_________________
const express = require('express');
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');
const ejs = require('ejs');
const methodOverride = require('method-override');
const path = require('path');
const fs = require('fs');
const Photo = require('./models/Photo');
const { redirect } = require('express/lib/response');

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
app.use(
  methodOverride('_method', {
    methods: ['POST', 'GET'],
  })
);

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

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);

  res.render('edit', {
    photo,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect('/photos/' + req.params.id);
});

app.delete('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  fs.unlinkSync(__dirname + '/public' + photo.image);
  await Photo.findByIdAndRemove(req.params.id);
  res.redirect('/');
});

//__________________________________________
//____________START THE SERVER______________
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
