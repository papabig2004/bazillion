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
        
        console.log('Получены данные формы:', {
            name,
            phone,
            center,
            timestamp: new Date().toISOString()
        });
        
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

        console.log('Подготовлены данные для отправки в Bitrix24:', {
            webhook_url: BITRIX_WEBHOOK_URL,
            data: bitrixData,
            timestamp: new Date().toISOString()
        });

        const response = await axios.post(BITRIX_WEBHOOK_URL, bitrixData);
        
        console.log('Ответ от Bitrix24:', {
            status: response.status,
            data: response.data,
            timestamp: new Date().toISOString()
        });
        
        res.json({ success: true, message: 'Lead received and sent to Bitrix24 successfully' });
    } catch (error) {
        console.error('Ошибка при обработке заявки:', {
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
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