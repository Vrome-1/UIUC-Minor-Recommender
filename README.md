# 🎓 UIUC Minor Recommender

Find your perfect minor at UIUC in seconds.
This app recommends the best-fit academic minors based on your interests, major, and course history — so you don't have to dig through outdated spreadsheets or guess your way through course catalogs.

**Now featuring AI-powered career insights!** 🤖 Get personalized career recommendations with salary ranges, job opportunities, and industry growth projections.

---

## 🚀 Features

- ✅ Personalized minor recommendations
- 📊 Filters by major, interests, and completed courses
- 🏛️ Real data from UIUC curriculum
- 🤖 AI-powered career insights (with Gemini API integration)
- 🧠 Smart backend with recommendation logic
- 💻 Sleek, fast frontend built with modern web tech
- 🔄 State persistence across navigation
- 📱 Responsive design for all devices

---

## 🛠️ Getting Started

Clone the repo, then run both the **backend** and **frontend** to get going!

### 1️⃣ Backend (Django - Python)

```bash
cd BackEnd-cs222-project
pip install -r requirements.txt
python manage.py runserver
```

### 2️⃣ Frontend (Next.js / React)

```bash
cd FrontEnd-cs222-project
npm install
npm run dev
```

> Make sure you have Python 3.9+, Django, Node.js 18+, and npm installed.

### 🔑 Optional: Enable AI Career Insights

To enable AI-powered career recommendations:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env` file in `BackEnd-cs222-project/` with:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
3. Restart the backend server

**Note:** The app works perfectly without AI - it includes smart fallback career insights for all major+minor combinations!

---

## 🧩 Technical Architecture

```txt
Frontend: React, Next.js, TailwindCSS, React Router
Backend: Django (Python), Django REST Framework, Google Gemini AI
Database: SQLite
Extras: Axios, TypeScript, ESLint, Prettier
```

---

## 📬 Contributors & Contact

### 🤝 **Original Contributors**
**Saumya Agarwal**, **Nathan Mcelroy**, and **Divya Thumu** initially helped with the project foundation and early development.

### 🎯 **Current Development**
**Vaani Rometra** is now leading the main development, implementing major features including:
- AI-powered career insights integration
- Complete UI/UX overhaul and state management
- Backend API development and optimization
- Cross-page navigation and data persistence

### 📧 **Contact**
Have feedback or want to build on it? Feel free to reach out:
- **Email:** vaanirometra@gmail.com
- **GitHub:** [@vaanirometra](https://github.com/vaanirometra)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
