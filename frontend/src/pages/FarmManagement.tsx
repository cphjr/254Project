import React, { useState } from 'react';

type FarmData = {
  weather: { [key: string]: string | number };
  soil: { [key: string]: string | number };
  [key: string]: any; // Allow dynamic keys if needed
};

const FarmManagement: React.FC = () => {
  const [farmData, setFarmData] = useState<FarmData>({
    weather: {},
    soil: {},
  });

  const updateField = (category: string, subfield: string, value: string | number) => {
    setFarmData((prev) => ({
      ...prev,
      [category]: {
        ...(prev[category] || {}), // Default to empty object if undefined
        [subfield]: value,
      },
    }));
  };

  return (
    <div>
      <h2>Farm Management</h2>
      <button onClick={() => updateField('weather', 'temperature', 25)}>Set Temp</button>
      <button onClick={() => updateField('soil', 'pH', 6.5)}>Set pH</button>
      <pre>{JSON.stringify(farmData, null, 2)}</pre>
    </div>
  );
};

export default FarmManagement;