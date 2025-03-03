import React from 'react';
import { Button } from '@mui/material';

const App = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
      <h1 style={{ color: 'black' }}>Testing Material-UI Button</h1>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </div>
  );
};

export default App;