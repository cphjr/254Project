import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';

interface SoilProperties {
  ph: string;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  organic_matter: string;
}

interface WeatherData {
  temperature: string;
  humidity: string;
  rainfall: string;
  soil_moisture: string;
}

interface WeatherEntry {
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  soil_moisture: number;
}

interface PredictionResult {
  predicted_yield: number;
  confidence_score: number;
  recommendations: string[];
}

interface FormData {
  cropType: string;
  fieldArea: string;
  planting_date: Date | null;
  soilType: string;
  soilProperties: SoilProperties;
  weather: WeatherData;
}

// Extract object-type keys from FormData
type ObjectKeys = 'soilProperties' | 'weather';

const YieldPrediction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    cropType: '',
    fieldArea: '',
    planting_date: null,
    soilType: '',
    soilProperties: {
      ph: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      organic_matter: '',
    },
    weather: {
      temperature: '',
      humidity: '',
      rainfall: '',
      soil_moisture: '',
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/predict/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop_type: formData.cropType,
          field_area: parseFloat(formData.fieldArea),
          planting_date: formData.planting_date?.toISOString(),
          soil_type: formData.soilType,
          soil_properties: {
            ph: parseFloat(formData.soilProperties.ph),
            nitrogen: parseFloat(formData.soilProperties.nitrogen),
            phosphorus: parseFloat(formData.soilProperties.phosphorus),
            potassium: parseFloat(formData.soilProperties.potassium),
            organic_matter: parseFloat(formData.soilProperties.organic_matter),
          },
          weather_data: [{
            date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss"),
            temperature: parseFloat(formData.weather.temperature),
            humidity: parseFloat(formData.weather.humidity),
            rainfall: parseFloat(formData.weather.rainfall),
            soil_moisture: parseFloat(formData.weather.soil_moisture),
          }],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | Date | null,
    category?: ObjectKeys,
    subfield?: string
  ) => {
    if (category && subfield) {
      setFormData((prev) => ({
        ...prev,
        [category]: {
          ...prev[category],
          [subfield]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Yield Prediction
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Basic Information
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Crop Type"
                      value={formData.cropType}
                      onChange={(e) => handleInputChange('cropType', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Field Area (hectares)"
                      type="number"
                      value={formData.fieldArea}
                      onChange={(e) => handleInputChange('fieldArea', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker
                      label="Planting Date"
                      value={formData.planting_date}
                      onChange={(date) => handleInputChange('planting_date', date)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Soil Type"
                      value={formData.soilType}
                      onChange={(e) => handleInputChange('soilType', e.target.value)}
                      required
                    />
                  </Grid>

                  {/* Soil Properties */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Soil Properties
                    </Typography>
                  </Grid>
                  {Object.entries(formData.soilProperties).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <TextField
                        fullWidth
                        label={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                        type="number"
                        value={value}
                        onChange={(e) => handleInputChange('soilProperties', e.target.value, 'soilProperties', key)}
                        required
                      />
                    </Grid>
                  ))}

                  {/* Weather Data */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Weather Data
                    </Typography>
                  </Grid>
                  {Object.entries(formData.weather).map(([key, value]) => (
                    <Grid item xs={12} sm={6} key={key}>
                      <TextField
                        fullWidth
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        type="number"
                        value={value}
                        onChange={(e) => handleInputChange('weather', e.target.value, 'weather', key)}
                        required
                      />
                    </Grid>
                  ))}

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      disabled={loading}
                      sx={{ mt: 2 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Get Prediction'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result && (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Prediction Results
                </Typography>
                <Typography variant="body1" paragraph>
                  Predicted Yield: {result.predicted_yield.toFixed(2)} tons/hectare
                </Typography>
                <Typography variant="body1" paragraph>
                  Confidence Score: {(result.confidence_score * 100).toFixed(1)}%
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  {result.recommendations.map((rec, index) => (
                    <Typography component="li" key={index}>
                      {rec}
                    </Typography>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default YieldPrediction;