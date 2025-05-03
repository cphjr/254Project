import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import joblib
from typing import List, Dict
from datetime import datetime

class CropYieldPredictor:
    def __init__(self):
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.scaler = StandardScaler()
        self.is_trained = False

    def _prepare_features(self, 
                         crop_type: str,
                         field_area: float,
                         planting_date: datetime,
                         soil_properties: Dict[str, float],
                         weather_data: List[Dict]) -> np.ndarray:
        """
        Prepare features for the model from raw input data.
        """
        # Calculate days since planting
        weather_df = pd.DataFrame(weather_data)
        weather_df['date'] = pd.to_datetime(weather_df['date'])
        weather_df['days_since_planting'] = (weather_df['date'] - planting_date).dt.days

        # Aggregate weather features
        weather_features = {
            'avg_temperature': weather_df['temperature'].mean(),
            'total_rainfall': weather_df['rainfall'].sum(),
            'avg_humidity': weather_df['humidity'].mean(),
            'avg_soil_moisture': weather_df['soil_moisture'].mean(),
            'temp_variation': weather_df['temperature'].std(),
            'rainfall_variation': weather_df['rainfall'].std()
        }

        # Combine all features
        features = {
            'field_area': field_area,
            'soil_ph': soil_properties.get('ph', 7.0),
            'soil_organic_matter': soil_properties.get('organic_matter', 0),
            'soil_nitrogen': soil_properties.get('nitrogen', 0),
            'soil_phosphorus': soil_properties.get('phosphorus', 0),
            'soil_potassium': soil_properties.get('potassium', 0),
            **weather_features
        }

        # Convert to numpy array
        feature_array = np.array(list(features.values())).reshape(1, -1)
        return feature_array

    def train(self, training_data: List[Dict]):
        """
        Train the model using historical data.
        """
        # Convert training data to features and targets
        X = []
        y = []
        
        for data in training_data:
            features = self._prepare_features(
                data['crop_type'],
                data['field_area'],
                data['planting_date'],
                data['soil_properties'],
                data['weather_data']
            )
            X.append(features.flatten())
            y.append(data['actual_yield'])

        X = np.array(X)
        y = np.array(y)

        # Scale features
        X_scaled = self.scaler.fit_transform(X)

        # Train the model
        self.model.fit(X_scaled, y)
        self.is_trained = True

    def predict(self,
                crop_type: str,
                field_area: float,
                planting_date: datetime,
                soil_properties: Dict[str, float],
                weather_data: List[Dict]) -> Dict:
        """
        Make yield predictions for new data.
        """
        if not self.is_trained:
            raise ValueError("Model needs to be trained before making predictions")

        # Prepare features
        features = self._prepare_features(
            crop_type,
            field_area,
            planting_date,
            soil_properties,
            weather_data
        )

        # Scale features
        features_scaled = self.scaler.transform(features)

        # Make prediction
        prediction = self.model.predict(features_scaled)[0]
        confidence_score = self._calculate_confidence_score(features_scaled)

        # Generate recommendations
        recommendations = self._generate_recommendations(
            prediction,
            crop_type,
            soil_properties,
            weather_data
        )

        return {
            'predicted_yield': float(prediction),
            'confidence_score': confidence_score,
            'recommendations': recommendations,
            'features_used': {
                'field_area': float(features[0, 0]),
                'soil_properties': soil_properties,
                'weather_metrics': {
                    'avg_temperature': float(features[0, 7]),
                    'total_rainfall': float(features[0, 8]),
                    'avg_humidity': float(features[0, 9])
                }
            }
        }

    def _calculate_confidence_score(self, features_scaled: np.ndarray) -> float:
        """
        Calculate a confidence score for the prediction.
        """
        # Get predictions from all trees in the forest
        predictions = [tree.predict(features_scaled)[0] 
                      for tree in self.model.estimators_]
        
        # Calculate the coefficient of variation
        cv = np.std(predictions) / np.mean(predictions)
        
        # Convert to confidence score (1 - normalized CV)
        confidence = 1 - min(cv, 1)
        return float(confidence)

    def _generate_recommendations(self,
                                prediction: float,
                                crop_type: str,
                                soil_properties: Dict[str, float],
                                weather_data: List[Dict]) -> List[str]:
        """
        Generate recommendations based on the prediction and input data.
        """
        recommendations = []

        # Soil-based recommendations
        ph = soil_properties.get('ph', 7.0)
        if ph < 6.0:
            recommendations.append(
                "Soil pH is low. Consider applying lime to increase pH for better nutrient absorption."
            )
        elif ph > 7.5:
            recommendations.append(
                "Soil pH is high. Consider adding sulfur or organic matter to reduce pH."
            )

        # Weather-based recommendations
        weather_df = pd.DataFrame(weather_data)
        avg_temp = weather_df['temperature'].mean()
        total_rain = weather_df['rainfall'].sum()

        if avg_temp > 30:
            recommendations.append(
                "High average temperature detected. Consider implementing shade structures or irrigation adjustments."
            )

        if total_rain < 100:  # Example threshold
            recommendations.append(
                "Low rainfall detected. Implement irrigation schedule to maintain optimal soil moisture."
            )

        return recommendations

    def save_model(self, path: str):
        """
        Save the trained model and scaler to disk.
        """
        if not self.is_trained:
            raise ValueError("Model needs to be trained before saving")
        
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'is_trained': self.is_trained
        }
        joblib.dump(model_data, path)

    def load_model(self, path: str):
        """
        Load a trained model and scaler from disk.
        """
        model_data = joblib.load(path)
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.is_trained = model_data['is_trained'] 