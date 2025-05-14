const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware для парсинга JSON
app.use(express.json());

// Настройка CORS
app.use(cors({
    origin: '*', // В продакшене лучше указать конкретные домены
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Статические файлы
app.use(express.static(path.join(__dirname)));

// API endpoint для обработки заявок
app.post('/api/lead', async (req, res) => {
    try {
        const { name, phone, center } = req.body;
        
        // Здесь можно добавить логику для отправки данных в Bitrix24
        // Например, через n8n или напрямую через API Bitrix24
        
        console.log('Received lead:', { name, phone, center });
        
        res.json({ success: true, message: 'Lead received successfully' });
    } catch (error) {
        console.error('Error processing lead:', error);
        res.status(500).json({ success: false, message: 'Error processing lead' });
    }
});

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 