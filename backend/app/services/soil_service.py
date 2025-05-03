import httpx
from typing import Dict, Optional
from fastapi import HTTPException

class SoilService:
    def __init__(self):
        self.base_url = "https://api.openepi.io/soil"

    async def get_soil_data(self, lat: float, lon: float) -> Dict:
        """
        Fetch soil data for given coordinates from OpenEPI API.
        
        Args:
            lat (float): Latitude
            lon (float): Longitude
            
        Returns:
            Dict: Soil data including properties like pH, organic matter, etc.
        """
        try:
            async with httpx.AsyncClient() as client:
                # Get soil type
                type_response = await client.get(
                    f"{self.base_url}/type",
                    params={"lat": lat, "lon": lon}
                )
                
                # Get soil properties
                property_response = await client.get(
                    f"{self.base_url}/property",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "depths": ["0-5cm", "5-15cm"],
                        "properties": ["phh2o", "soc", "nitrogen"],
                        "values": ["mean"]
                    }
                )
                
                if type_response.status_code != 200 or property_response.status_code != 200:
                    raise HTTPException(
                        status_code=500,
                        detail="Failed to fetch soil data"
                    )
                
                type_data = type_response.json()
                property_data = property_response.json()
                
                # Extract soil type
                soil_type = type_data.get("properties", {}).get("most_probable_soil_type", "unknown")
                
                # Extract soil properties
                properties = {}
                for layer in property_data.get("properties", {}).get("layers", []):
                    if layer["name"] == "pH in H2O":
                        properties["ph"] = layer["depths"][0]["values"]["mean"]
                    elif layer["name"] == "Soil organic carbon":
                        properties["organic_matter"] = layer["depths"][0]["values"]["mean"]
                    elif layer["name"] == "Total nitrogen":
                        properties["nitrogen"] = layer["depths"][0]["values"]["mean"]
                
                return {
                    "soil_type": soil_type,
                    "ph": properties.get("ph", 7.0),
                    "organic_matter": properties.get("organic_matter", 0),
                    "nitrogen": properties.get("nitrogen", 0),
                    "phosphorus": 0,  # Not available in the API
                    "potassium": 0,   # Not available in the API
                    "texture": "unknown",  # Not available in the API
                    "drainage": "unknown"  # Not available in the API
                }
                
        except httpx.RequestError as e:
            raise HTTPException(
                status_code=500,
                detail=f"Error connecting to soil API: {str(e)}"
            )
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Unexpected error: {str(e)}"
            )

# Create a singleton instance
soil_service = SoilService() 