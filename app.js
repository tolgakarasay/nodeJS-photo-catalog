//__________________________________________
//__________________MODULES_________________
const express = require('express');
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');
const ejs = require('ejs');
const methodOverride = require('method-override');
const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageControllers');

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

app.get('/', photoController.getAllPhotos);
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);
app.get('/add', pageController.getAddPage);
app.get('/photos/edit/:id', pageController.getEditPage);

//__________________________________________
//____________START THE SERVER______________
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
