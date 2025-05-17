require('dotenv').config();
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

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
        
        // Настройки Bitrix24
        const BITRIX_DOMAIN = process.env.BITRIX_DOMAIN; // например: your-domain.bitrix24.ru
        const BITRIX_USER_ID = process.env.BITRIX_USER_ID; // ID пользователя
        const BITRIX_WEBHOOK_TOKEN = process.env.BITRIX_WEBHOOK_TOKEN; // токен вебхука
        
        console.log('Параметры Bitrix24:', {
            domain: BITRIX_DOMAIN,
            userId: BITRIX_USER_ID,
            token: BITRIX_WEBHOOK_TOKEN ? '***' : undefined
        });
        
        if (!BITRIX_DOMAIN || !BITRIX_USER_ID || !BITRIX_WEBHOOK_TOKEN) {
            console.error('Не настроены параметры Bitrix24:', {
                domain: BITRIX_DOMAIN ? '✓' : '✗',
                userId: BITRIX_USER_ID ? '✓' : '✗',
                token: BITRIX_WEBHOOK_TOKEN ? '✓' : '✗'
            });
            return res.status(500).json({ success: false, message: 'Ошибка конфигурации сервера' });
        }

        const bitrixUrl = `https://${BITRIX_DOMAIN}/rest/${BITRIX_USER_ID}/${BITRIX_WEBHOOK_TOKEN}/crm.lead.add.json`;
        
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
            url: bitrixUrl,
            data: bitrixData,
            timestamp: new Date().toISOString()
        });

        const response = await axios.post(bitrixUrl, bitrixData);
        
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
    try {
        const indexPath = path.join(__dirname, 'index.html');
        console.log('Attempting to serve index.html from:', indexPath);
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('Error serving index.html:', err);
                res.status(500).send('Error loading page');
            }
        });
    } catch (error) {
        console.error('Error in root route:', error);
        res.status(500).send('Server error');
    }
});

// Обработка 404
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).send('Server error');
});

// Запуск сервера
app.listen(port, () => {
    console.log('=== Конфигурация сервера ===');
    console.log(`Порт: ${port}`);
    console.log('Переменные окружения:');
    console.log('- BITRIX_DOMAIN:', process.env.BITRIX_DOMAIN ? 'Настроен' : 'Не настроен');
    console.log('- BITRIX_USER_ID:', process.env.BITRIX_USER_ID ? 'Настроен' : 'Не настроен');
    console.log('- BITRIX_WEBHOOK_TOKEN:', process.env.BITRIX_WEBHOOK_TOKEN ? 'Настроен' : 'Не настроен');
    console.log('==========================');
    console.log(`Server is running on port ${port}`);
}); 