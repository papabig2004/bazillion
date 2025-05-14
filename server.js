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
        
        // Настройки amoCRM
        const AMO_DOMAIN = process.env.AMO_DOMAIN;
        const AMO_ACCESS_TOKEN = process.env.AMO_ACCESS_TOKEN;
        
        if (!AMO_DOMAIN || !AMO_ACCESS_TOKEN) {
            console.error('AMO_DOMAIN или AMO_ACCESS_TOKEN не настроены');
            return res.status(500).json({ success: false, message: 'Ошибка конфигурации сервера' });
        }

        const amoData = {
            name: `Заявка с сайта - ${center}`,
            price: 0,
            responsible_user_id: 0, // ID ответственного менеджера
            pipeline_id: 0, // ID воронки
            status_id: 0, // ID статуса
            custom_fields_values: [
                {
                    field_id: 0, // ID поля для телефона
                    values: [
                        {
                            value: phone
                        }
                    ]
                },
                {
                    field_id: 0, // ID поля для центра
                    values: [
                        {
                            value: center
                        }
                    ]
                }
            ]
        };

        const headers = {
            'Authorization': `Bearer ${AMO_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
        };

        await axios.post(`https://${AMO_DOMAIN}/api/v4/leads`, amoData, { headers });
        
        console.log('Lead sent to amoCRM:', { name, phone, center });
        
        res.json({ success: true, message: 'Lead received and sent to amoCRM successfully' });
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