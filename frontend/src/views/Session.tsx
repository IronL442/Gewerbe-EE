import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Session: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sessionTopic, setSessionTopic] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    draw(e);
  };

  const stopDrawing = () => setDrawing(false);

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signatureData = canvas.toDataURL();
    if (
      !studentName ||
      !date ||
      !startTime ||
      !endTime ||
      !sessionTopic ||
      signatureData === "data:,"
    ) {
      setError("All fields and signature are required!");
      return;
    }

    try {
      const response = await axios.post("/sessions/session", {
        student_name: studentName,
        date,
        start_time: startTime,
        end_time: endTime,
        session_topic: sessionTopic,
        signature_data: signatureData,
      });
      if (response.status === 200) {
        // Reset form fields to show an empty log session form
        setStudentName("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setSessionTopic("");
        clearSignature();
        setError(""); // Clear any previous errors
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to log session");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Log New Session</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Student Name</label>
          <input
            type="text"
            name="student_name"
            className="form-control"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Start Time</label>
          <input
            type="time"
            name="start_time"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">End Time</label>
          <input
            type="time"
            name="end_time"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Session Topic</label>
          <input
            type="text"
            name="session_topic"
            className="form-control"
            value={sessionTopic}
            onChange={(e) => setSessionTopic(e.target.value)}
            required
          />
        </div>

          <div className="mb-3">
            <p className="text-muted">
            By signing below, you agree to our{" "}
              <a href="/privacy" className="text-primary text-decoration-underline" target="_blank" rel="noopener noreferrer">
              Privacy Policy
              </a>.
            </p>
          </div>

        <h2>Sign below</h2>
        <div className="mb-3">
          <canvas
            id="signature-pad"
            className="signature-pad border"
            width={400}
            height={200}
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
          />
        </div>
        <button type="submit" className="btn btn-success">
          Save Session
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={clearSignature}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default Session;
