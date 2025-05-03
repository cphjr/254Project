# Crop Yield Prediction System

## Overview
This project is an AI-powered crop yield prediction system that helps farmers make data-driven decisions about their agricultural practices. The system uses machine learning to analyze historical data, weather patterns, and soil conditions to provide accurate yield predictions and actionable insights.

## Features
- Real-time weather data integration
- Soil quality analysis using OpenEPI Soil API
- Machine learning-based yield predictions
- Interactive dashboard for farmers
- Automated data collection and preprocessing
- Real-time alerts and notifications
- Historical data visualization

## Tech Stack
- **Backend**: Python, FastAPI, SQLAlchemy
- **Frontend**: React, TypeScript, Material-UI
- **Database**: PostgreSQL
- **Machine Learning**: scikit-learn, TensorFlow
- **Data Processing**: pandas, numpy
- **API Integration**: OpenWeatherMap API, OpenEPI Soil API

## Project Structure
```
crop-yield-prediction/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   ├── api/           # API routes
│   │   └── ml/            # Machine learning models
│   ├── tests/             # Backend tests
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   └── package.json      # Node dependencies
└── docker/               # Docker configuration
```

## Setup Instructions
1. Clone the repository
2. Set up the backend:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Set up the frontend:
   ```bash
   cd frontend
   npm install
   ```
4. Configure environment variables
5. Start the development servers:
   - Backend: `uvicorn app.main:app --reload`
   - Frontend: `npm start`

## Environment Variables
Create `.env` files in both backend and frontend directories with the following variables:
```
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/crop_yield_db
OPENWEATHER_API_KEY=your_api_key
OPENEPI_API_KEY=your_openepi_api_key

# Frontend
REACT_APP_API_URL=http://localhost:8000
```

## API Documentation
Once the backend server is running, visit `http://localhost:8000/docs` for the interactive API documentation.
