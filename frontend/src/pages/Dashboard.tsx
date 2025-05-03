import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  Agriculture as AgricultureIcon,
  Cloud as CloudIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
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

const Dashboard: React.FC = () => {
  const theme = useTheme();

  // Sample data for the charts
  const yieldData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Predicted Yield',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: theme.palette.primary.main,
        tension: 0.1,
      },
      {
        label: 'Actual Yield',
        data: [70, 62, 75, 85, 60, 58],
        borderColor: theme.palette.secondary.main,
        tension: 0.1,
      },
    ],
  };

  const weatherData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [22, 24, 27, 23, 25, 28, 26],
        borderColor: theme.palette.error.main,
        tension: 0.1,
      },
      {
        label: 'Rainfall (mm)',
        data: [30, 10, 0, 15, 5, 0, 0],
        borderColor: theme.palette.info.main,
        tension: 0.1,
      },
    ],
  };

  const summaryCards = [
    {
      title: 'Total Farms',
      value: '12',
      icon: <AgricultureIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main,
    },
    {
      title: 'Active Predictions',
      value: '8',
      icon: <TimelineIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.secondary.main,
    },
    {
      title: 'Weather Alerts',
      value: '3',
      icon: <WarningIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.error.main,
    },
    {
      title: 'Data Points',
      value: '1.2K',
      icon: <CloudIcon sx={{ fontSize: 40 }} />,
      color: theme.palette.info.main,
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} mb={4}>
        {summaryCards.map((card) => (
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

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Yield Predictions vs Actual
              </Typography>
              <Box height={300}>
                <Line
                  data={yieldData}
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
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weather Trends
              </Typography>
              <Box height={300}>
                <Line
                  data={weatherData}
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
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 