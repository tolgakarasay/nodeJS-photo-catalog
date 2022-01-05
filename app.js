// Express sayesinde HTTP metodlarını kolaylıkla kullanabiliriz.
const express = require('express');
const app = express();

// path modülünü import edelim. Path bir core modül olduğu için download gerekmeden çağırınca gelir.
const path = require('path');

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

// get request de aslında bir middleware'dir.
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'temp/index.html'));
});

// Sunucuyu başlatalım
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});

// not: request ve response arasında bulunan herşey middleware'dir. Routing bile middleware'dir.
