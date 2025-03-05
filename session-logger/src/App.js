import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Card, CardContent, TextField, Button, Typography, Box } from "@mui/material";

const SessionLogger = () => {
    // Get today's date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [studentName, setStudentName] = useState("");
    const [sessionTopic, setSessionTopic] = useState("");
    const [sessionDate, setSessionDate] = useState(getCurrentDate()); // Default to today's date
    const signatureRef = useRef(null);

    const clearSignature = () => {
        signatureRef.current.clear();
    };

    const saveSession = () => {
        if (studentName && sessionTopic && sessionDate && !signatureRef.current.isEmpty()) {
            // Save session logic here (e.g., to a database)
            setStudentName("");
            setSessionTopic("");
            setSessionDate(getCurrentDate()); // Reset to today's date after saving
            signatureRef.current.clear();
        }
    };

    return (
        <Box p={4}>
            <Card variant="outlined" sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h5" component="h2" sx={{ mb: 2 }}>Log Session</Typography>
                    <TextField
                        fullWidth
                        label="Student Name"
                        variant="outlined"
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Session Topic"
                        variant="outlined"
                        multiline
                        rows={3}
                        value={sessionTopic}
                        onChange={e => setSessionTopic(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Session Date"
                        variant="outlined"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={sessionDate}
                        onChange={e => setSessionDate(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Typography variant="h6" component="h3" sx={{ mt: 2, mb: 1 }}>Signature:</Typography>
                    <SignatureCanvas
                        penColor="black"
                        ref={signatureRef}
                        canvasProps={{
                            className: "signatureCanvas",
                            style: {
                                border: '1px solid #ccc',
                                width: '100%',
                                height: '250px',  // Increased height for larger signature box
                                marginBottom: '8px'
                            }
                        }}
                    />
                    <Box display="flex" gap={2} mb={2}>
                        <Button variant="outlined" color="secondary" onClick={clearSignature}>Clear Signature</Button>
                        <Button variant="contained" color="primary" onClick={saveSession}>Save Session</Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default SessionLogger;