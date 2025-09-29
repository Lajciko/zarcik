
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const IMAGES_DIR = path.join(__dirname, 'images');

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(__dirname));


app.get('/', (req, res) => {
  let files = [];
  try {
    files = fs.readdirSync(IMAGES_DIR).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.avif'].includes(ext);
    });
  } catch (err) {
    console.error('Błąd odczytu katalogu images:', err.message);
  }

  if (!files || files.length === 0) {
    return res.send(`
      <!doctype html>
      <html lang="pl">
      <head>
        <meta charset="utf-8">
        <title>Brak obrazów</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Brak obrazów w katalogu <code class="code">images</code></h1>
        <p>Dodaj pliki .jpg lub .png do katalogu <code class="code">images</code> i odśwież stronę.</p>
      </body>
      </html>
    `);
  }

  const choice = files[Math.floor(Math.random() * files.length)];
 
  const randomParam = Math.random().toString(36).substring(2, 10);
  const imageUrl = `/images/${encodeURIComponent(choice)}?v=${randomParam}`;

  res.send(`
    <!doctype html>
    <html lang="pl">
    <head>
      <meta charset="utf-8">
      <title>Losowy obraz</title>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>Losowy obraz z katalogu images</h1>
      <img src="${imageUrl}" alt="Losowy obraz">
      <p>Plik: ${choice}</p>
      <form method="get" action="/">
        <button type="submit">Pokaż inny</button>
      </form>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Serwis działa na http://localhost:${PORT} — umieść obrazy w katalogu ./images`);
});
