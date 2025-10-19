const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Статические файлы
app.use(express.static('src/examples'));
app.use(express.static('dist'));

// Главная страница - выбор примера
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Naberika - Примеры</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0;
            }
            .container {
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                padding: 40px;
                text-align: center;
                max-width: 600px;
            }
            h1 {
                color: #333;
                margin-bottom: 20px;
                font-size: 2.5rem;
            }
            p {
                color: #666;
                margin-bottom: 30px;
                font-size: 1.2rem;
            }
            .examples {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-top: 30px;
            }
            .example-card {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 30px;
                text-decoration: none;
                color: #333;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            .example-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                border-color: #4facfe;
            }
            .example-card h3 {
                margin-bottom: 15px;
                font-size: 1.5rem;
            }
            .example-card p {
                margin: 0;
                font-size: 1rem;
                color: #666;
            }
            .js-card {
                border-left: 4px solid #007bff;
            }
            .vue-card {
                border-left: 4px solid #42b883;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🏗️ Naberika</h1>
            <p>Блочный конструктор с чистой архитектурой</p>
            
            <div class="examples">
                <a href="/pure-js-example.html" class="example-card js-card">
                    <h3>📄 Чистый JavaScript</h3>
                    <p>Демонстрация работы с HTML шаблонами и чистой архитектурой</p>
                </a>
                
                <a href="/vue3-example.html" class="example-card vue-card">
                    <h3>🎨 Vue3 Компоненты</h3>
                    <p>Демонстрация работы с Vue3 компонентами и реактивностью</p>
                </a>
            </div>
        </div>
    </body>
    </html>
  `);
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
