import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  WbSunny as SunIcon,
  Opacity as RainIcon,
  Air as WindIcon,
  Thermostat as TempIcon,
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherData {
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  soil_moisture: number;
}

const WeatherDataPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);

  useEffect(() => {
    fetchWeatherData();
  }, [selectedField]);

  const fetchWeatherData = async () => {
    try {
      // In a real application, this would fetch from your API
      const mockData: WeatherData[] = [
        {
          date: '2024-03-01',
          temperature: 25,
          humidity: 65,
          rainfall: 10,
          soil_moisture: 45,
        },
        {
          date: '2024-03-02',
          temperature: 26,
          humidity: 70,
          rainfall: 5,
          soil_moisture: 42,
        },
        {
          date: '2024-03-03',
          temperature: 24,
          humidity: 68,
          rainfall: 15,
          soil_moisture: 48,
        },
        {
          date: '2024-03-04',
          temperature: 23,
          humidity: 72,
          rainfall: 20,
          soil_moisture: 50,
        },
        {
          date: '2024-03-05',
          temperature: 25,
          humidity: 67,
          rainfall: 8,
          soil_moisture: 46,
        },
      ];

      setWeatherData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLoading(false);
    }
  };

  const chartData = {
    labels: weatherData.map(data => data.date),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: weatherData.map(data => data.temperature),
        borderColor: '#f44336',
        tension: 0.1,
      },
      {
        label: 'Humidity (%)',
        data: weatherData.map(data => data.humidity),
        borderColor: '#2196f3',
        tension: 0.1,
      },
      {
        label: 'Rainfall (mm)',
        data: weatherData.map(data => data.rainfall),
        borderColor: '#4caf50',
        tension: 0.1,
      },
      {
        label: 'Soil Moisture (%)',
        data: weatherData.map(data => data.soil_moisture),
        borderColor: '#ff9800',
        tension: 0.1,
      },
    ],
  };

  const weatherCards = [
    {
      title: 'Temperature',
      value: `${weatherData[weatherData.length - 1]?.temperature ?? 0}°C`,
      icon: <TempIcon sx={{ fontSize: 40 }} />,
      color: '#f44336',
    },
    {
      title: 'Humidity',
      value: `${weatherData[weatherData.length - 1]?.humidity ?? 0}%`,
      icon: <SunIcon sx={{ fontSize: 40 }} />,
      color: '#2196f3',
    },
    {
      title: 'Rainfall',
      value: `${weatherData[weatherData.length - 1]?.rainfall ?? 0}mm`,
      icon: <RainIcon sx={{ fontSize: 40 }} />,
      color: '#4caf50',
    },
    {
      title: 'Soil Moisture',
      value: `${weatherData[weatherData.length - 1]?.soil_moisture ?? 0}%`,
      icon: <WindIcon sx={{ fontSize: 40 }} />,
      color: '#ff9800',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Weather Data
      </Typography>

      {/* Weather Cards */}
      <Grid container spacing={3} mb={4}>
        {weatherCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography color="textSecondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Weather Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weather Trends
          </Typography>
          <Box height={400}>
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Weather Data Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weather History
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Temperature (°C)</TableCell>
                  <TableCell>Humidity (%)</TableCell>
                  <TableCell>Rainfall (mm)</TableCell>
                  <TableCell>Soil Moisture (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {weatherData.map((data) => (
                  <TableRow key={data.date}>
                    <TableCell>{data.date}</TableCell>
                    <TableCell>{data.temperature}</TableCell>
                    <TableCell>{data.humidity}</TableCell>
                    <TableCell>{data.rainfall}</TableCell>
                    <TableCell>{data.soil_moisture}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WeatherDataPage; 