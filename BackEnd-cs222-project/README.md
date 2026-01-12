# UIUC Minor Recommender - Backend

This Django backend provides APIs for the UIUC Minor Recommender application.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Start the server:
```bash
python manage.py runserver
```

## API Endpoints

- `GET /api/classNames/` - Get all course names
- `GET /api/subjectNames/` - Get all subject names
- `POST /api/minor_progress/` - Calculate minor progress
- `POST /api/job_recommendations/` - Get job recommendations
- `POST /api/career_insights/` - Get AI-generated career insights

## Gemini AI Integration (Optional)

To enable AI-generated career insights:

1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. Create a `.env` file in the project root:
```bash
GEMINI_API_KEY=your_api_key_here
```

3. Install additional packages:
```bash
pip install google-generativeai python-dotenv
```

The API will automatically use AI-generated insights when the API key is available, otherwise it falls back to static data.

## Career Insights API

```bash
curl -X POST http://localhost:8000/api/career_insights/ \
  -H "Content-Type: application/json" \
  -d '{"major": "Computer Science", "minor": "Data Science"}'
```

Response includes:
- Job types
- Salary ranges
- Top locations
- Top companies
- Growth outlook
- Key skills