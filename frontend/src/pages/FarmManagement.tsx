import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';

interface Farm {
  id: number;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  total_area: number;
}

interface Field {
  id: number;
  farm_id: number;
  name: string;
  area: number;
  soil_type: string;
  soil_properties: {
    ph: number;
    organic_matter: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
  };
}

const FarmManagement: React.FC = () => {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [openFarmDialog, setOpenFarmDialog] = useState(false);
  const [openFieldDialog, setOpenFieldDialog] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);

  const [farmForm, setFarmForm] = useState({
    name: '',
    location: '',
    latitude: '',
    longitude: '',
    total_area: '',
  });

  const [fieldForm, setFieldForm] = useState({
    name: '',
    area: '',
    soil_type: '',
    soil_properties: {
      ph: '',
      organic_matter: '',
      nitrogen: '',
      phosphorus: '',
      potassium: '',
    },
  });

  useEffect(() => {
    fetchFarms();
    fetchFields();
  }, []);

  const fetchFarms = async () => {
    try {
      const response = await fetch('http://localhost:8000/farms/');
      if (!response.ok) throw new Error('Failed to fetch farms');
      const data = await response.json();
      setFarms(data);
    } catch (error) {
      console.error('Error fetching farms:', error);
    }
  };

  const fetchFields = async () => {
    try {
      const response = await fetch('http://localhost:8000/fields/');
      if (!response.ok) throw new Error('Failed to fetch fields');
      const data = await response.json();
      setFields(data);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const handleFarmSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/farms/', {
        method: selectedFarm ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...farmForm,
          latitude: parseFloat(farmForm.latitude),
          longitude: parseFloat(farmForm.longitude),
          total_area: parseFloat(farmForm.total_area),
        }),
      });

      if (!response.ok) throw new Error('Failed to save farm');
      
      fetchFarms();
      setOpenFarmDialog(false);
      resetFarmForm();
    } catch (error) {
      console.error('Error saving farm:', error);
    }
  };

  const handleFieldSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/fields/', {
        method: selectedField ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...fieldForm,
          farm_id: selectedFarm?.id,
          area: parseFloat(fieldForm.area),
          soil_properties: {
            ph: parseFloat(fieldForm.soil_properties.ph),
            organic_matter: parseFloat(fieldForm.soil_properties.organic_matter),
            nitrogen: parseFloat(fieldForm.soil_properties.nitrogen),
            phosphorus: parseFloat(fieldForm.soil_properties.phosphorus),
            potassium: parseFloat(fieldForm.soil_properties.potassium),
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to save field');
      
      fetchFields();
      setOpenFieldDialog(false);
      resetFieldForm();
    } catch (error) {
      console.error('Error saving field:', error);
    }
  };

  const resetFarmForm = () => {
    setFarmForm({
      name: '',
      location: '',
      latitude: '',
      longitude: '',
      total_area: '',
    });
    setSelectedFarm(null);
  };

  const resetFieldForm = () => {
    setFieldForm({
      name: '',
      area: '',
      soil_type: '',
      soil_properties: {
        ph: '',
        organic_matter: '',
        nitrogen: '',
        phosphorus: '',
        potassium: '',
      },
    });
    setSelectedField(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Farm Management
      </Typography>

      {/* Farms Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Farms</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenFarmDialog(true)}
            >
              Add Farm
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Coordinates</TableCell>
                  <TableCell>Total Area (ha)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {farms.map((farm) => (
                  <TableRow key={farm.id}>
                    <TableCell>{farm.name}</TableCell>
                    <TableCell>{farm.location}</TableCell>
                    <TableCell>
                      {farm.latitude}, {farm.longitude}
                    </TableCell>
                    <TableCell>{farm.total_area}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => {
                          setSelectedFarm(farm);
                          setFarmForm({
                            name: farm.name,
                            location: farm.location,
                            latitude: farm.latitude.toString(),
                            longitude: farm.longitude.toString(),
                            total_area: farm.total_area.toString(),
                          });
                          setOpenFarmDialog(true);
                        }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Fields Section */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Fields</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenFieldDialog(true)}
              disabled={!selectedFarm}
            >
              Add Field
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Farm</TableCell>
                  <TableCell>Area (ha)</TableCell>
                  <TableCell>Soil Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell>{field.name}</TableCell>
                    <TableCell>
                      {farms.find(f => f.id === field.farm_id)?.name}
                    </TableCell>
                    <TableCell>{field.area}</TableCell>
                    <TableCell>{field.soil_type}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => {
                          setSelectedField(field);
                          setFieldForm({
                            name: field.name,
                            area: field.area.toString(),
                            soil_type: field.soil_type,
                            soil_properties: {
                              ph: field.soil_properties.ph.toString(),
                              organic_matter: field.soil_properties.organic_matter.toString(),
                              nitrogen: field.soil_properties.nitrogen.toString(),
                              phosphorus: field.soil_properties.phosphorus.toString(),
                              potassium: field.soil_properties.potassium.toString(),
                            },
                          });
                          setOpenFieldDialog(true);
                        }}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Farm Dialog */}
      <Dialog open={openFarmDialog} onClose={() => {
        setOpenFarmDialog(false);
        resetFarmForm();
      }}>
        <DialogTitle>
          {selectedFarm ? 'Edit Farm' : 'Add New Farm'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Farm Name"
                value={farmForm.name}
                onChange={(e) => setFarmForm({ ...farmForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={farmForm.location}
                onChange={(e) => setFarmForm({ ...farmForm, location: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={farmForm.latitude}
                onChange={(e) => setFarmForm({ ...farmForm, latitude: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={farmForm.longitude}
                onChange={(e) => setFarmForm({ ...farmForm, longitude: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Total Area (hectares)"
                type="number"
                value={farmForm.total_area}
                onChange={(e) => setFarmForm({ ...farmForm, total_area: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenFarmDialog(false);
            resetFarmForm();
          }}>
            Cancel
          </Button>
          <Button onClick={handleFarmSubmit} variant="contained">
            {selectedFarm ? 'Save Changes' : 'Add Farm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Field Dialog */}
      <Dialog open={openFieldDialog} onClose={() => {
        setOpenFieldDialog(false);
        resetFieldForm();
      }}>
        <DialogTitle>
          {selectedField ? 'Edit Field' : 'Add New Field'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Field Name"
                value={fieldForm.name}
                onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Area (hectares)"
                type="number"
                value={fieldForm.area}
                onChange={(e) => setFieldForm({ ...fieldForm, area: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Soil Type"
                value={fieldForm.soil_type}
                onChange={(e) => setFieldForm({ ...fieldForm, soil_type: e.target.value })}
              />
            </Grid>
            {Object.entries(fieldForm.soil_properties).map(([key, value]) => (
              <Grid item xs={6} key={key}>
                <TextField
                  fullWidth
                  label={key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                  type="number"
                  value={value}
                  onChange={(e) => setFieldForm({
                    ...fieldForm,
                    soil_properties: {
                      ...fieldForm.soil_properties,
                      [key]: e.target.value,
                    },
                  })}
                />
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenFieldDialog(false);
            resetFieldForm();
          }}>
            Cancel
          </Button>
          <Button onClick={handleFieldSubmit} variant="contained">
            {selectedField ? 'Save Changes' : 'Add Field'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmManagement; 