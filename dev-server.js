const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Статические файлы
app.use(express.static('src/examples'));
app.use(express.static('dist'));

// Главная страница
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src/examples/index.html'));
});

// API для разработки
app.get('/api/blocks', (req, res) => {
  res.json({
    blocks: [],
    message: 'API для разработки Naberika'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Сервер разработки запущен на http://localhost:${PORT}`);
  console.log(`📁 Примеры доступны в папке src/examples/`);
  console.log(`🔧 Для сборки используйте: npm run build`);
});
