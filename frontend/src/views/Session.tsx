import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
declare module "html2canvas";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Session: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sessionTopic, setSessionTopic] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
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

    if (!privacyConsent) {
      setError("Bitte stimmen Sie der Datenschutzerklärung zu.");
      return;
    }

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
      // 📸 Create a visual screenshot of the form
      const screenshotCanvas = await html2canvas(formRef.current!);
      const imageData = screenshotCanvas.toDataURL("image/png");

      // 📄 Convert to PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (screenshotCanvas.height * pdfWidth) / screenshotCanvas.width;
      pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");

      // 📦 Package and send as FormData
      const formData = new FormData();
      formData.append("student_name", studentName);
      formData.append("date", date);
      formData.append("start_time", startTime);
      formData.append("end_time", endTime);
      formData.append("session_topic", sessionTopic);
      formData.append("pdf", pdfBlob);

      const response = await axios.post("/sessions/session", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        // Reset form
        setStudentName("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setSessionTopic("");
        clearSignature();
        setPrivacyConsent(false);
        setError("");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to log session");
    }
  };

  return (
    <div className="container mt-5">
      <div ref={formRef}>
        <h2>Log New Session</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Student Name</label>
            <input
              type="text"
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
              className="form-control"
              value={sessionTopic}
              onChange={(e) => setSessionTopic(e.target.value)}
              required
            />
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="privacyConsent"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="privacyConsent">
              Ich habe die{" "}
              <a
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-underline"
              >
                Datenschutzerklärung
              </a>{" "}
              gelesen und stimme ihr zu.
            </label>
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
    </div>
  );
};

export default Session;