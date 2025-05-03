from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    total_area = Column(Float)  # in hectares
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    fields = relationship("Field", back_populates="farm")

class Field(Base):
    __tablename__ = "fields"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"))
    name = Column(String)
    area = Column(Float)  # in hectares
    soil_type = Column(String)
    soil_properties = Column(JSON)  # pH, organic matter, etc.
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farm = relationship("Farm", back_populates="fields")
    crops = relationship("Crop", back_populates="field")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("fields.id"))
    crop_type = Column(String)
    planting_date = Column(DateTime)
    harvest_date = Column(DateTime, nullable=True)
    expected_yield = Column(Float, nullable=True)  # in tons per hectare
    actual_yield = Column(Float, nullable=True)  # in tons per hectare
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    field = relationship("Field", back_populates="crops")
    weather_data = relationship("WeatherData", back_populates="crop")

class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    date = Column(DateTime)
    temperature = Column(Float)
    humidity = Column(Float)
    rainfall = Column(Float)
    soil_moisture = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    crop = relationship("Crop", back_populates="weather_data")

class YieldPrediction(Base):
    __tablename__ = "yield_predictions"

    id = Column(Integer, primary_key=True, index=True)
    crop_id = Column(Integer, ForeignKey("crops.id"))
    predicted_yield = Column(Float)  # in tons per hectare
    confidence_score = Column(Float)
    prediction_date = Column(DateTime, default=datetime.datetime.utcnow)
    features_used = Column(JSON)  # Store the features used for prediction
    created_at = Column(DateTime, default=datetime.datetime.utcnow) 