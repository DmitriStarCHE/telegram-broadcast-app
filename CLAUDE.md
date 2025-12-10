# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Telegram Broadcast App - A web application for managing broadcast announcements to Telegram chats with multi-user support, templates, and preview functionality. Written in Russian.

**Tech Stack:**
- Backend: Node.js + Express + SQLite + JWT + node-telegram-bot-api
- Frontend: Framework7 v8 + Vanilla JavaScript (ES6+)

**Project Status:**
- Backend: 100% complete and production-ready
- Frontend: 70% complete (HTML pages and routing still needed)

## Development Commands

### Backend

```bash
# Start development server with nodemon
cd backend
npm run dev

# Start production server
npm start

# Check server health
curl http://localhost:3000/api/health
```

Backend runs on `http://localhost:3000` by default.

### Frontend

The frontend is static HTML/JS/CSS served via any HTTP server:

```bash
# Option 1: Python HTTP server
cd frontend
python -m http.server 5500

# Option 2: Node http-server
npm install -g http-server
cd frontend
http-server -p 5500
```

Frontend runs on `http://127.0.0.1:5500`.

### Database

SQLite database is auto-initialized on first backend startup via `backend/src/database/init.js`. Schema is defined in `backend/src/database/migrations/001_initial_schema.sql`.

**To reset database:** Delete `backend/data/database.sqlite` and restart the server.

## Code Architecture

### Backend Architecture (MVC Pattern)

**Entry Point Flow:**
1. `server.js` - Server startup and database initialization
2. `src/app.js` - Express app configuration, middleware, and routes mounting
3. Routes → Controllers → Services → Models → Database

**Key Architectural Patterns:**

**Authentication & Authorization:**
- JWT tokens with 24-hour expiration
- Middleware `src/middleware/auth.js` protects all routes except auth endpoints
- Tokens stored in localStorage on frontend, sent via `Authorization: Bearer <token>` header
- Password hashing with bcrypt (saltRounds: 10)

**Broadcast System (Async with Logging):**
- `broadcastService.js` orchestrates the entire broadcast flow
- Uses `setImmediate()` to run broadcasts asynchronously (non-blocking)
- Telegram API calls via `telegramService.js` with 150ms delays between messages (rate limiting)
- Two-level logging:
  - `broadcast_logs` table: Overall broadcast metadata (total/success/fail counts, status)
  - `broadcast_details` table: Per-chat send results (status, message_id, errors)
- Status progression: `pending` → `in_progress` → `completed`
- Template variables (e.g., `{{company}}`, `{{price}}`) substituted before sending

**Database Layer:**
- Models in `src/models/` directory use raw SQLite3 API (no ORM)
- Each model returns Promises wrapping `db.run/db.get/db.all`
- Foreign keys enabled: `PRAGMA foreign_keys = ON`
- Connection management: Models use `getDb()` from `config/database.js` to get connection pool

**Error Handling:**
- Centralized error handler: `src/middleware/errorHandler.js`
- All async route handlers wrapped in try-catch
- Telegram API errors (400/401/403/429) caught and logged to `broadcast_details`

**Validation:**
- Uses `express-validator` middleware
- Validation rules defined in `src/middleware/validation.js`
- Applied per-route in route files

### Frontend Architecture (Framework7 SPA)

**Structure:**
- `index.html` - Shell app with Framework7 initialization
- `css/app.css` - All styles and component definitions
- `js/services/` - Service layer (API client, auth manager, storage wrapper)
  - `api.js` - HTTP client with 22 API methods organized by domain
  - `auth.js` - JWT token management (get/set/remove)
  - `storage.js` - localStorage wrapper with JSON serialization

**Still TODO (70% complete):**
- `js/routes.js` - Framework7 routing configuration
- `js/app.js` - Framework7 initialization and global handlers
- `pages/*.html` - Page templates (login, chats, templates, broadcast, settings)

**When completing frontend:**
- Follow Framework7 v8 patterns (component-based pages)
- Use Framework7 Router for navigation
- API calls via `api.js` service
- Store JWT tokens via `authService.setToken()`

## Database Schema

**6 Tables with Foreign Keys:**

1. `users` - User accounts (username, email, password_hash, role)
2. `bot_settings` - Telegram bot tokens per user (one token per user)
3. `chats` - Telegram chats (chat_id, chat_name, description, is_active)
4. `templates` - Message templates with variables (3 slots per user)
5. `broadcast_logs` - Broadcast metadata (total/success/fail counts, status)
6. `broadcast_details` - Per-chat send results (status, message_id, errors)

**Important Constraints:**
- `(user_id, chat_id)` unique in `chats` table
- `(user_id, slot_number)` unique in `templates` table (slots: 1, 2, 3)

**Indexes:**
- `idx_chats_user_id`
- `idx_templates_user_id`
- `idx_broadcast_logs_user_id`
- `idx_broadcast_details_log_id`

## API Endpoints

**Authentication (public):**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Get JWT token
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout (client-side token removal)

**Chats (protected):**
- `GET /api/chats` - List all user's chats
- `POST /api/chats` - Add new chat
- `PUT /api/chats/:id` - Update chat name/description
- `DELETE /api/chats/:id` - Delete chat
- `PATCH /api/chats/:id/toggle` - Toggle chat active status

**Templates (protected):**
- `GET /api/templates` - Get all 3 template slots
- `GET /api/templates/:slot` - Get specific slot (1-3)
- `POST /api/templates` - Save template to slot
- `DELETE /api/templates/:slot` - Delete template from slot

**Broadcast (protected):**
- `POST /api/broadcast/preview` - Preview message with variable substitution
- `POST /api/broadcast/send` - Send broadcast (async, returns immediately)
- `GET /api/broadcast/history?limit=50` - List past broadcasts
- `GET /api/broadcast/:id` - Get broadcast summary
- `GET /api/broadcast/:id/details` - Get per-chat send results

**Settings (protected):**
- `GET /api/settings/bot` - Get bot token status
- `PUT /api/settings/bot` - Save bot token
- `POST /api/settings/bot/test` - Validate bot token via Telegram API
- `GET /api/settings/profile` - Get user profile
- `PUT /api/settings/password` - Change password

## Environment Configuration

**Required `.env` file in `backend/` directory:**

```env
PORT=3000
JWT_SECRET=your_super_secret_key_change_in_production
NODE_ENV=development
DATABASE_PATH=./data/database.sqlite
FRONTEND_URL=http://127.0.0.1:5500  # Optional, for CORS
```

**Security Notes:**
- `.env` file is in `.gitignore` - never commit it
- Change `JWT_SECRET` in production to a strong random string
- SQLite database files (`backend/data/*.sqlite`) are in `.gitignore`

## Important Implementation Notes

### Telegram Bot Integration

**Bot Token Setup:**
1. User creates bot via @BotFather on Telegram
2. User copies token (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
3. User adds token in Settings page
4. Backend validates token via `telegramService.validateToken()` (calls `getMe()`)
5. Token stored in `bot_settings` table per user

**Rate Limiting:**
- Telegram allows 30 messages/second
- App uses 150ms delay between messages (6.6 msg/sec)
- Safe margin to avoid 429 (Too Many Requests) errors

**Error Handling:**
- 400 Bad Request: Invalid chat_id format
- 401 Unauthorized: Invalid bot token
- 403 Forbidden: Bot blocked/kicked from chat
- 429 Too Many Requests: Rate limit exceeded (rare with delays)
- All errors logged to `broadcast_details.error_message`

### Template Variable System

**Syntax:** Variables use double curly braces: `{{variable_name}}`

**Example Template:**
```
Delivery from {{company}}

Diameter: {{diameter}}mm
Price: {{price}} rubles/ton
Date: {{date}}

Call: {{phone}}
```

**Variable Substitution:**
- Happens in `broadcastService.applyVariables(content, variables)`
- Uses regex replacement: `/\{\{key\}\}/g`
- Missing variables replaced with empty string
- Variables stored as JSON in `templates.variables` column

## Testing the Application

**Backend Testing Flow:**
1. Start backend: `cd backend && npm run dev`
2. Register user: `POST /api/auth/register`
3. Login: `POST /api/auth/login` (get JWT token)
4. Add bot token: `PUT /api/settings/bot`
5. Test token: `POST /api/settings/bot/test`
6. Add test chat: `POST /api/chats` (use your Telegram chat_id)
7. Create template: `POST /api/templates` with variables
8. Preview: `POST /api/broadcast/preview`
9. Send: `POST /api/broadcast/send`
10. Check history: `GET /api/broadcast/history`

**Get Telegram Chat ID:**
- For groups: Use @userinfobot in the group
- Or send message and check: `https://api.telegram.org/bot<TOKEN>/getUpdates`
- Group IDs are negative numbers (e.g., `-1001234567890`)

## Common Pitfalls

**CORS Issues:**
- Backend CORS configured for `http://127.0.0.1:5500` by default
- If frontend runs on different port, update `FRONTEND_URL` in `.env`
- Or update `cors()` config in `src/app.js`

**Bot Token Errors:**
- Token must be complete string from @BotFather
- No spaces or newlines
- Format: `<numbers>:<letters_numbers>`

**Chat Not Found:**
- Bot must be added to group/channel first
- Bot must have admin rights to send messages
- Group chat IDs start with `-100`

**Database Lock Errors:**
- SQLite doesn't handle high concurrency well
- For production with many simultaneous broadcasts, consider PostgreSQL
- Current implementation: one broadcast at a time per user

## Future Extensions (Planned)

**Pipe Calculator:**
- Formula: π * ((D² - d²) / 4) * L * ρ
- New table: `pipe_calculations`
- Integration with template variables

**Photo Attachments:**
- Use multer for file uploads
- Store in `backend/uploads/`
- Send via `bot.sendPhoto()` instead of `sendMessage()`
- Max size: 10MB (JPG/PNG/GIF)

## Code Style Conventions

**Backend:**
- Use async/await (not callbacks or raw Promises)
- Error handling: try-catch in controllers
- Models return Promises wrapping SQLite operations
- Services contain business logic (no direct DB access)
- Controllers are thin (validate → call service → return response)

**Frontend:**
- ES6+ syntax (arrow functions, destructuring, template literals)
- Service layer for all API calls (don't use fetch directly in pages)
- Framework7 component syntax for page handlers
- Store state in Framework7 app.data or localStorage

**Russian Language:**
- UI text in Russian
- Code comments in Russian
- Variable names in English
- Error messages in Russian for user-facing, English for logs
