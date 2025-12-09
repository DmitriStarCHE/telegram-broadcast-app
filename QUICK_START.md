# Быстрый старт

## 1. Запуск Backend

```bash
cd backend
npm run dev
```

Сервер запустится на `http://localhost:3000`

## 2. Запуск Frontend

**Windows (Git Bash):**
```bash
cd frontend
python -m http.server 5500
```

**Или используйте Live Server в VS Code**

Откройте браузер: `http://127.0.0.1:5500`

## 3. Первый запуск

1. Зарегистрируйтесь (username, email, password)
2. В настройках добавьте Telegram Bot Token
3. Добавьте чаты с их Chat ID
4. Создайте шаблон объявления
5. Отправьте тестовую рассылку!

## Получение Telegram Bot Token

1. Откройте https://t.me/BotFather
2. Отправьте `/newbot`
3. Следуйте инструкциям
4. Скопируйте токен (формат: `123456:ABCdef...`)

## Получение Chat ID

**Для группы:**
1. Добавьте @userinfobot в группу
2. Скопируйте Chat ID (например: `-1001234567890`)

**Для личного чата:**
1. Отправьте сообщение боту @userinfobot
2. Скопируйте ваш Chat ID

## Текущее состояние

✅ Backend полностью готов (все API работают)
✅ База данных SQLite настроена
✅ JWT авторизация реализована
✅ Telegram интеграция работает
✅ Система рассылки с логированием

⚠️ Frontend частично готов:
- Структура создана
- API сервисы готовы (api.js, auth.js, storage.js)
- Нужно дополнить: routes.js, app.js, HTML страницы

## Тестирование API через curl

### Регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'
```

### Логин
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```

### Health Check
```bash
curl http://localhost:3000/api/health
```

## Следующие шаги

Для завершения frontend вам нужно создать:

1. **frontend/js/routes.js** - роутинг Framework7
2. **frontend/js/app.js** - инициализация Framework7
3. **frontend/pages/login.html** - страница входа
4. **frontend/pages/chats.html** - управление чатами
5. **frontend/pages/templates.html** - шаблоны (3 слота)
6. **frontend/pages/broadcast.html** - рассылка
7. **frontend/pages/settings.html** - настройки

Все backend API уже работают и готовы к использованию!
