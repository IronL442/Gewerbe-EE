import React from 'react';
import { Button, TextField } from '@mui/material';

const App = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2>Test: Material-UI Components</h2>
      <TextField label="Name" variant="outlined" fullWidth style={{ marginBottom: '10px' }} />
      <Button variant="contained">Submit</Button>
    </div>
  );
};

export default App;