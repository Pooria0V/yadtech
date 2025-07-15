# 🧠 Advanced Study Planner (Forgetting Curve Based)

This is a simple and practical web application for planning study sessions using the **Forgetting Curve** method. Users can log their lessons and receive scheduled reviews based on spaced repetition. The project is built with the following technologies:

---

## ⚙️ Technologies Used

### 🧩 Frontend:
- HTML5 / CSS3 (with Dark Mode support)
- Vanilla JavaScript
- Responsive UI (Mobile/Desktop friendly)

### 🖥 Backend:
- Python 3.x
- Django 4.x
- Django REST Framework
- JWT Authentication (`djangorestframework-simplejwt`)
- CORS Headers (`django-cors-headers`)

---

## 🚀 Features

- Add lessons + auto-generated review schedule (Days 1, 3, 7, 30, 60)
- User registration and login (JWT-based)
- Today's study sessions shown separately
- Dark mode toggle (🌙 / ☀️)
- Modal popups for login, registration, and contact info
- Fully responsive for all screen sizes

---

## 🔧 Backend Setup (Django)

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd yadtech

# 2. Create virtual environment & install dependencies
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# 3. Run migrations
python manage.py migrate

# 4. Start development server
python manage.py runserver
```

