# Telegram Broadcast App

Веб-приложение для управления рассылками объявлений в Telegram с многопользовательской системой, шаблонами и предпросмотром.

## Возможности

- Многопользовательская система с JWT авторизацией
- Управление списком Telegram чатов (добавление/удаление)
- 3 слота для шаблонов объявлений с поддержкой переменных `{{variable}}`
- Предпросмотр и подтверждение перед рассылкой
- Детальная статистика по каждой рассылке
- Адаптивный интерфейс на Framework7

## Технологии

**Backend:**
- Node.js + Express
- SQLite
- JWT Authentication (bcrypt)
- Telegram Bot API (node-telegram-bot-api)

**Frontend:**
- Framework7 v8
- Vanilla JavaScript (ES6+)
- HTML5 + CSS3

## Установка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd Truba
```

### 2. Backend установка

```bash
cd backend
npm install
```

### 3. Настройка окружения

Отредактируйте файл `backend/.env`:

```env
PORT=3000
JWT_SECRET=your_super_secret_key_change_in_production
NODE_ENV=development
DATABASE_PATH=./data/database.sqlite
```

### 4. Создание Telegram бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/BotFather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям: укажите имя и username бота
4. Скопируйте токен бота (формат: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Добавьте бота в нужные группы/каналы
6. Дайте боту права администратора для отправки сообщений

### 5. Получение Chat ID

**Вариант 1 - Через бота [@userinfobot](https://t.me/userinfobot):**
1. Добавьте @userinfobot в вашу группу
2. Бот отправит сообщение с Chat ID группы

**Вариант 2 - Через API:**
1. Отправьте любое сообщение в группу
2. Откройте: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
3. Найдите `"chat":{"id":-1234567890}` в JSON ответе

## Запуск

### Backend

```bash
cd backend
npm run dev  # Development mode с nodemon
# или
npm start    # Production mode
```

Сервер запустится на `http://localhost:3000`

### Frontend

**Вариант 1 - Live Server (VS Code):**
1. Установите расширение "Live Server" в VS Code
2. Откройте `frontend/index.html`
3. Нажмите правой кнопкой → "Open with Live Server"

**Вариант 2 - Python HTTP Server:**
```bash
cd frontend
python -m http.server 5500
```

Откройте браузер: `http://127.0.0.1:5500`

**Вариант 3 - Node HTTP Server:**
```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

## Использование

### 1. Регистрация

1. Откройте приложение
2. Нажмите "Регистрация"
3. Заполните форму (username, email, password)
4. После регистрации вы автоматически войдете в систему

### 2. Настройка Telegram бота

1. Откройте "Настройки" в боковом меню
2. Вставьте ваш Telegram Bot Token
3. Нажмите "Сохранить"
4. Проверьте валидность токена кнопкой "Проверить токен"

### 3. Добавление чатов

1. Откройте "Чаты"
2. Нажмите кнопку "+" (FAB)
3. Введите:
   - **Chat ID** (например: `-1001234567890` для групп)
   - **Название** (для удобства)
   - **Описание** (опционально)
4. Нажмите "Добавить"

### 4. Создание шаблонов

1. Откройте "Шаблоны"
2. Выберите свободный слот (1, 2 или 3)
3. Нажмите "Редактировать"
4. Заполните:
   - **Название** шаблона
   - **Содержание** с переменными: `{{company}}`, `{{price}}`, `{{date}}`
5. Нажмите "Сохранить"

**Пример шаблона:**
```
Доставка труб от {{company}}

Диаметр: {{diameter}}мм
Цена: {{price}} руб/тонна
Срок: {{date}}

Звоните: {{phone}}
```

### 5. Рассылка объявления

1. Откройте "Рассылка"
2. Выберите шаблон (кнопки 1/2/3)
3. Отредактируйте текст или заполните переменные
4. Выберите чаты для рассылки (чекбоксы)
5. Нажмите "Предпросмотр"
6. Проверьте итоговый текст и список получателей
7. Нажмите "Отправить"
8. Следите за прогрессом рассылки

### 6. История рассылок

1. Откройте "Настройки" → "История рассылок"
2. Просмотрите список всех рассылок
3. Нажмите на рассылку для просмотра деталей:
   - Сколько сообщений отправлено успешно
   - Какие чаты получили сообщение
   - Какие ошибки возникли

## API Документация

### Authentication

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
```

### Chats

```
GET    /api/chats
POST   /api/chats
PUT    /api/chats/:id
DELETE /api/chats/:id
PATCH  /api/chats/:id/toggle
```

### Templates

```
GET    /api/templates
GET    /api/templates/:slot
POST   /api/templates
DELETE /api/templates/:slot
```

### Broadcast

```
POST /api/broadcast/preview
POST /api/broadcast/send
GET  /api/broadcast/history
GET  /api/broadcast/:id
GET  /api/broadcast/:id/details
```

### Settings

```
GET  /api/settings/bot
PUT  /api/settings/bot
POST /api/settings/bot/test
GET  /api/settings/profile
PUT  /api/settings/password
```

## Структура проекта

```
Truba/
├── backend/
│   ├── src/
│   │   ├── config/         # Конфигурация БД, Telegram
│   │   ├── controllers/    # API контроллеры
│   │   ├── middleware/     # Auth, validation, errors
│   │   ├── models/         # Модели БД
│   │   ├── routes/         # Express маршруты
│   │   ├── services/       # Бизнес-логика
│   │   └── database/       # Миграции БД
│   ├── data/               # SQLite файл
│   └── server.js           # Точка входа
│
└── frontend/
    ├── css/                # Стили
    ├── js/
    │   ├── services/       # API, auth, storage
    │   ├── pages/          # Логика страниц
    │   ├── app.js          # Framework7 init
    │   └── routes.js       # Роутинг
    ├── pages/              # HTML шаблоны
    └── index.html          # Shell SPA
```

## Troubleshooting

### Backend не запускается

```bash
# Проверьте порт
netstat -ano | findstr :3000

# Удалите node_modules и переустановите
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Ошибка "Bot token invalid"

1. Проверьте формат токена: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
2. Убедитесь, что токен скопирован полностью
3. Проверьте токен через: `https://api.telegram.org/bot<TOKEN>/getMe`

### Ошибка "Chat not found" при рассылке

1. Убедитесь, что бот добавлен в чат/группу
2. Дайте боту права администратора
3. Проверьте правильность Chat ID (для групп начинается с `-100`)

### CORS ошибки

Отредактируйте `backend/src/app.js`:
```javascript
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Ваш frontend URL
  credentials: true
}));
```

## Будущие расширения

### Трубный калькулятор

Планируется добавить встроенный калькулятор для расчета тоннажа труб:
- Ввод: диаметр, толщина стенки, длина
- Формула: π * ((D² - d²) / 4) * L * ρ
- Сохранение расчетов в БД
- Интеграция с шаблонами объявлений

### Добавление фото

Возможность прикреплять фото к объявлениям:
- Загрузка изображений (JPG, PNG, GIF)
- Хранение в `backend/uploads/`
- Отправка через `bot.sendPhoto()`
- Ограничение размера файла (10MB)

## Лицензия

MIT

## Поддержка

При возникновении вопросов создайте issue в репозитории.
