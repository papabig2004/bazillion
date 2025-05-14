const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

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
        
        // Отправка данных в Bitrix24
        const BITRIX_WEBHOOK_URL = process.env.BITRIX_WEBHOOK_URL;
        
        if (!BITRIX_WEBHOOK_URL) {
            console.error('BITRIX_WEBHOOK_URL не настроен');
            return res.status(500).json({ success: false, message: 'Ошибка конфигурации сервера' });
        }

        const bitrixData = {
            fields: {
                TITLE: `Заявка с сайта - ${center}`,
                NAME: name,
                PHONE: [{ VALUE: phone, VALUE_TYPE: 'WORK' }],
                COMMENTS: `Центр: ${center}`,
                SOURCE_ID: 'WEB',
                SOURCE_DESCRIPTION: 'Заявка с сайта Базиллион'
            }
        };

        await axios.post(BITRIX_WEBHOOK_URL, bitrixData);
        
        console.log('Lead sent to Bitrix24:', { name, phone, center });
        
        res.json({ success: true, message: 'Lead received and sent to Bitrix24 successfully' });
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