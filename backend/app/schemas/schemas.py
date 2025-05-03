from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from datetime import datetime

class FarmBase(BaseModel):
    name: str
    location: str
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)
    total_area: float = Field(..., gt=0)

class FarmCreate(FarmBase):
    pass

class Farm(FarmBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class FieldBase(BaseModel):
    name: str
    area: float = Field(..., gt=0)
    soil_type: str
    soil_properties: Dict[str, float]

class FieldCreate(FieldBase):
    farm_id: int

class Field(FieldBase):
    id: int
    farm_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class CropBase(BaseModel):
    crop_type: str
    planting_date: datetime
    expected_yield: Optional[float] = None
    actual_yield: Optional[float] = None

class CropCreate(CropBase):
    field_id: int

class Crop(CropBase):
    id: int
    field_id: int
    harvest_date: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WeatherDataBase(BaseModel):
    date: datetime
    temperature: float
    humidity: float
    rainfall: float
    soil_moisture: float

class WeatherDataCreate(WeatherDataBase):
    crop_id: int

class WeatherData(WeatherDataBase):
    id: int
    crop_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class YieldPredictionBase(BaseModel):
    predicted_yield: float
    confidence_score: float
    features_used: Dict[str, float]

class YieldPredictionCreate(YieldPredictionBase):
    crop_id: int

class YieldPrediction(YieldPredictionBase):
    id: int
    crop_id: int
    prediction_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class PredictionRequest(BaseModel):
    crop_type: str
    field_area: float
    planting_date: datetime
    soil_type: str
    soil_properties: Dict[str, float]
    weather_data: List[WeatherDataBase]

class PredictionResponse(BaseModel):
    predicted_yield: float
    confidence_score: float
    prediction_date: datetime
    features_used: Dict[str, float]
    recommendations: List[str] 