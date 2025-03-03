import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Card, CardContent, Button, TextField, FormLabel } from '@mui/material';

const App = () => {
  const [studentName, setStudentName] = useState('');
  const [date, setDate] = useState('');
  const [topic, setTopic] = useState('');
  const signaturePad = useRef(null);

  const handleClear = () => {
    signaturePad.current.clear();
  };

  const handleSubmit = () => {
    if (signaturePad.current.isEmpty()) {
      alert('Please provide a signature.');
      return;
    }
    const signatureData = signaturePad.current.toDataURL();
    const data = { studentName, date, topic, signature: signatureData };
    console.log('Submitted data:', data);
    // API call to backend will go here
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Card className="w-full max-w-lg p-4">
        <CardContent>
          <h2 className="text-xl mb-4">Log a Private Lesson</h2>
          <div className="mb-2">
            <FormLabel>Student Name</FormLabel>
            <TextField value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Enter student name" fullWidth />
          </div>
          <div className="mb-2">
            <FormLabel>Date</FormLabel>
            <TextField type="date" value={date} onChange={e => setDate(e.target.value)} fullWidth />
          </div>
          <div className="mb-2">
            <FormLabel>Topic</FormLabel>
            <TextField value={topic} onChange={e => setTopic(e.target.value)} placeholder="Enter topic" fullWidth />
          </div>
          <div className="mb-2">
            <FormLabel>Signature</FormLabel>
            <SignatureCanvas ref={signaturePad} penColor="black" canvasProps={{ className: "signature-canvas w-full h-32 border" }} />
            <Button onClick={handleClear} className="mt-2">Clear Signature</Button>
          </div>
          <Button onClick={handleSubmit} className="mt-4">Submit</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
