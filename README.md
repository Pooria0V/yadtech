# 🧠 Advanced Study Planner

A full-stack web application for managing and reviewing study sessions based on the **Forgetting Curve** methodology. It supports spaced repetition reviews, user authentication, dark mode, and a responsive interface.

---

## 📌 Features

- 🔐 User authentication (JWT-based: access + refresh)
- 📚 Create lessons with initial duration and study date
- 🔁 Auto-generate review sessions (1, 3, 7, 30, 60 days later)
- 📅 Today’s sessions table (filtered per current date)
- 🌙 Dark mode toggle
- 📲 Responsive layout for mobile/tablet
- 📬 Contact modal (email, Telegram, phone)
- ⚙️ Frontend/backend separation with CORS configuration

---

## 🧰 Tech Stack

### Frontend:
- HTML5 / CSS3 / JavaScript (Vanilla)
- Responsive design (media queries)
- Modal UI for login/signup/contact
- Dark mode toggle
- LocalStorage for token management

### Backend:
- Python 3.x
- Django 4.x
- Django REST Framework
- SimpleJWT (JWT authentication)
- django-cors-headers (CORS handling)
- SQLite (development DB)

---

## 📂 Project Structure

```
yadtech/
├── manage.py
├── yadtech/               # Django project root
│   ├── settings.py
│   └── urls.py
├── planner/               # Django app for study planning
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
└── frontend/              # Static frontend files
    ├── index.html
    ├── style.css
    └── script.js
```

---

## ⚙️ Backend Setup

```bash
# 1. Clone repo
git clone https://github.com/your-username/study-planner.git
cd study-planner

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Run migrations
python manage.py migrate

# 5. Run development server
python manage.py runserver
```

---

## 🌐 Frontend Setup

You can run the frontend via any static server or directly open the `index.html` file in browser.

```bash
# Optionally use a tool like live-server
cd frontend
live-server .
```

Or just open:

```
file:///path/to/frontend/index.html
```

> Ensure backend API is running on `http://127.0.0.1:8000/` and CORS settings are enabled.

---

## 🔐 API Endpoints

| Method | Endpoint                | Description               |
|--------|-------------------------|---------------------------|
| POST   | `/api/register/`        | User registration         |
| POST   | `/api/token/`           | Get JWT access + refresh  |
| POST   | `/api/token/refresh/`   | Get new access token      |
| GET/POST | `/api/lessons/`       | Get/add lessons           |
| GET/POST | `/api/sessions/`      | Get/add review sessions   |

All protected endpoints require an `Authorization: Bearer <access_token>` header.

---

## 🛡 CORS Configuration (in `settings.py`)

```python
INSTALLED_APPS += ['corsheaders']
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware', ...]
CORS_ALLOW_ALL_ORIGINS = True  # For development only
```

In production:

```python
CORS_ALLOWED_ORIGINS = ['http://localhost:5500']
```

---

## ✅ How It Works

- Users register and login to obtain JWT access & refresh tokens.
- Lessons are created with a study title, duration, and date.
- Review sessions are auto-generated with decreasing durations using the forgetting curve.
- Lessons and sessions are fetched via API and rendered in tables.
- Today's sessions are shown by comparing dates with the current system date.
- All tokens are stored and refreshed in localStorage.
- Dark mode state is also stored in localStorage.

---

## 📈 Future Enhancements

- 📅 Calendar view for sessions
- 📊 Progress tracking and analytics
- ✅ Mark sessions as completed
- 🔔 Reminder notifications (browser/email)
- 🌍 Internationalization (i18n)
- 🧪 Unit tests for backend APIs

---

## 📬 Contact

Click “ارتباط با ما” on the site or use:

- 📧 Email: example@example.com
- 📱 Telegram: @your_username
- ☎️ Phone: +98-912-000-0000

---

## 📜 License

MIT License
