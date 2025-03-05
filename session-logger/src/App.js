import React, { useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
const Card = ({ children }) => <div style={{ padding: '16px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '16px' }}>{children}</div>;
const CardContent = ({ children }) => <div>{children}</div>;
const Button = ({ onClick, children, className }) => (
    <button onClick={onClick} style={{ padding: '8px 16px', backgroundColor: '#1d4ed8', color: '#fff', borderRadius: '4px', margin: '4px 0' }}>
        {children}
    </button>
);

const SessionLogger = () => {
    const [studentName, setStudentName] = useState("");
    const [sessionTopic, setSessionTopic] = useState("");
    const [sessionDate, setSessionDate] = useState("");
    const [sessions, setSessions] = useState([]);
    const signatureRef = useRef(null);

    const clearSignature = () => {
        signatureRef.current.clear();
    };

    const saveSession = () => {
        if (studentName && sessionTopic && sessionDate && !signatureRef.current.isEmpty()) {
            const newSession = {
                studentName,
                sessionTopic,
                sessionDate,
                signature: signatureRef.current.toDataURL()
            };
            setSessions([...sessions, newSession]);
            setStudentName("");
            setSessionTopic("");
            setSessionDate("");
            signatureRef.current.clear();
        }
    };

    return (
        <div className="p-4">
            <Card>
                <CardContent>
                    <h2 className="text-xl font-bold mb-4">Log Session</h2>
                    <input className="w-full mb-2 p-2 border" placeholder="Student Name" value={studentName} onChange={e => setStudentName(e.target.value)} />
                    <textarea className="w-full mb-2 p-2 border" placeholder="Session Topic" value={sessionTopic} onChange={e => setSessionTopic(e.target.value)} />
                    <input type="date" className="w-full mb-2 p-2 border" value={sessionDate} onChange={e => setSessionDate(e.target.value)} />
                    <h3 className="mt-4 mb-2">Signature:</h3>
                    <SignatureCanvas penColor="black" ref={signatureRef} canvasProps={{ className: "border w-full h-32 mb-2" }} />
                    <Button onClick={clearSignature} className="mb-2">Clear Signature</Button>
                    <Button onClick={saveSession} className="w-full">Save Session</Button>
                </CardContent>
            </Card>
            <h2 className="text-xl font-bold mt-4">Logged Sessions</h2>
            {sessions.length === 0 ? <p>No sessions recorded yet.</p> : (
                <ul>
                    {sessions.map((session, index) => (
                        <li key={index} className="mb-2 border-b pb-2">
                            <strong>{session.studentName}</strong> - {session.sessionDate}
                            <p>{session.sessionTopic}</p>
                            <img src={session.signature} alt="Signature" className="w-32 border mt-2" />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SessionLogger;
