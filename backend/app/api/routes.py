from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..models.database import get_db
from ..models import models
from ..schemas import schemas
from ..ml.predictor import CropYieldPredictor
from ..services.soil_service import soil_service
import os
from datetime import datetime

router = APIRouter()
predictor = CropYieldPredictor()

# Load the model if it exists
MODEL_PATH = "app/ml/trained_model.joblib"
if os.path.exists(MODEL_PATH):
    predictor.load_model(MODEL_PATH)

@router.post("/farms/", response_model=schemas.Farm)
def create_farm(farm: schemas.FarmCreate, db: Session = Depends(get_db)):
    db_farm = models.Farm(**farm.dict())
    db.add(db_farm)
    db.commit()
    db.refresh(db_farm)
    return db_farm

@router.get("/farms/", response_model=List[schemas.Farm])
def get_farms(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    farms = db.query(models.Farm).offset(skip).limit(limit).all()
    return farms

@router.post("/fields/", response_model=schemas.Field)
async def create_field(field: schemas.FieldCreate, db: Session = Depends(get_db)):
    # Get the farm to access its coordinates
    farm = db.query(models.Farm).filter(models.Farm.id == field.farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    
    try:
        # Fetch soil data from OpenEPI API
        soil_data = await soil_service.get_soil_data(farm.latitude, farm.longitude)
        
        # Create field with soil data
        db_field = models.Field(
            **field.dict(),
            soil_properties=soil_data
        )
        db.add(db_field)
        db.commit()
        db.refresh(db_field)
        return db_field
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/fields/", response_model=List[schemas.Field])
def get_fields(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    fields = db.query(models.Field).offset(skip).limit(limit).all()
    return fields

@router.post("/crops/", response_model=schemas.Crop)
def create_crop(crop: schemas.CropCreate, db: Session = Depends(get_db)):
    db_crop = models.Crop(**crop.dict())
    db.add(db_crop)
    db.commit()
    db.refresh(db_crop)
    return db_crop

@router.get("/crops/", response_model=List[schemas.Crop])
def get_crops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    crops = db.query(models.Crop).offset(skip).limit(limit).all()
    return crops

@router.post("/weather-data/", response_model=schemas.WeatherData)
def create_weather_data(weather_data: schemas.WeatherDataCreate, db: Session = Depends(get_db)):
    db_weather = models.WeatherData(**weather_data.dict())
    db.add(db_weather)
    db.commit()
    db.refresh(db_weather)
    return db_weather

@router.post("/predict/", response_model=schemas.PredictionResponse)
def predict_yield(request: schemas.PredictionRequest):
    if not predictor.is_trained:
        raise HTTPException(status_code=400, detail="Model is not trained yet")
    
    try:
        prediction = predictor.predict(
            crop_type=request.crop_type,
            field_area=request.field_area,
            planting_date=request.planting_date,
            soil_properties=request.soil_properties,
            weather_data=[data.dict() for data in request.weather_data]
        )
        
        return schemas.PredictionResponse(
            predicted_yield=prediction['predicted_yield'],
            confidence_score=prediction['confidence_score'],
            prediction_date=datetime.now(),
            features_used=prediction['features_used'],
            recommendations=prediction['recommendations']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/train/")
def train_model(db: Session = Depends(get_db)):
    # Get all crops with their weather data
    crops = db.query(models.Crop).all()
    
    training_data = []
    for crop in crops:
        if crop.actual_yield is not None:  # Only use crops with known yields
            field = db.query(models.Field).filter(models.Field.id == crop.field_id).first()
            weather_data = db.query(models.WeatherData).filter(
                models.WeatherData.crop_id == crop.id
            ).all()
            
            training_data.append({
                'crop_type': crop.crop_type,
                'field_area': field.area,
                'planting_date': crop.planting_date,
                'soil_properties': field.soil_properties,
                'weather_data': [w.__dict__ for w in weather_data],
                'actual_yield': crop.actual_yield
            })
    
    if not training_data:
        raise HTTPException(status_code=400, detail="No training data available")
    
    try:
        predictor.train(training_data)
        predictor.save_model(MODEL_PATH)
        return {"message": "Model trained successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 