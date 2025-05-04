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
2. Run docker-compose up --build

## Frontend hosted
go to localhost:3000

## API Documentation
Once the backend server is running, visit `http://localhost:8000/docs` for the interactive API documentation.
