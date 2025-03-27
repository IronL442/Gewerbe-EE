import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const Session: React.FC = () => {
  const [studentName, setStudentName] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [sessionTopic, setSessionTopic] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [drawing, setDrawing] = useState(false);
  const navigate = useNavigate();

  // Initialize canvas settings
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

  // Handle drawing on canvas
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    setHasSignature(true); // Mark signature as present
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
    setHasSignature(false); // Reset signature presence
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { [key: string]: string } = {};

    if (!studentName) newErrors["studentName"] = "Student name is required.";
    if (!date) newErrors["date"] = "Date is required.";
    if (!startTime) newErrors["startTime"] = "Start time is required.";
    if (!endTime) newErrors["endTime"] = "End time is required.";
    if (!sessionTopic) newErrors["sessionTopic"] = "Session topic is required.";
    if (!privacyConsent) newErrors["privacyConsent"] = "You must agree to the privacy policy.";
    if (!hasSignature) newErrors["signature"] = "Signature is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const screenshotCanvas = await html2canvas(formRef.current!);
      const imageData = screenshotCanvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (screenshotCanvas.height * pdfWidth) / screenshotCanvas.width;
      pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
      const pdfBlob = pdf.output("blob");

      const formData = new FormData();
      formData.append("student_name", studentName);
      formData.append("date", date);
      formData.append("start_time", startTime);
      formData.append("end_time", endTime);
      formData.append("session_topic", sessionTopic);
      formData.append("pdf", pdfBlob);
      formData.append("signature_present", hasSignature ? "true" : "false");

      const response = await axios.post("/sessions/session", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        setStudentName("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setSessionTopic("");
        clearSignature();
        setPrivacyConsent(false);
        setErrors({});
      }
    } catch (err: any) {
      setErrors({ general: err.response?.data?.error || "Failed to log session" });
    }
  };

  return (
    <div className="container mt-5">
      <div ref={formRef}>
        <h2>Log New Session</h2>
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        
        <form onSubmit={handleSubmit} noValidate>
          {[
            { label: "Student Name", value: studentName, setValue: setStudentName, id: "studentName" },
            { label: "Date", value: date, setValue: setDate, id: "date", type: "date" },
            { label: "Start Time", value: startTime, setValue: setStartTime, id: "startTime", type: "time" },
            { label: "End Time", value: endTime, setValue: setEndTime, id: "endTime", type: "time" },
            { label: "Session Topic", value: sessionTopic, setValue: setSessionTopic, id: "sessionTopic" }
          ].map(({ label, value, setValue, id, type = "text" }) => (
            <div className="mb-3" key={id}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                className={`form-control ${errors[id] ? "is-invalid" : ""}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-invalid={!!errors[id]}
                aria-describedby={`${id}Error`}
              />
              {errors[id] && <div id={`${id}Error`} className="invalid-feedback">{errors[id]}</div>}
            </div>
          ))}

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="privacyConsent"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="privacyConsent">
              I have read and agree to the{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
            </label>
            {errors.privacyConsent && <div className="text-danger">{errors.privacyConsent}</div>}
          </div>

          <h2>Sign below</h2>
          <canvas
            className={`signature-pad border ${errors.signature ? "border-danger" : ""}`}
            width={400}
            height={200}
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
          />
          {errors.signature && <div className="text-danger mt-2">{errors.signature}</div>}

          <button type="submit" className="btn btn-success">Save Session</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={clearSignature}>Clear Signature</button>
        </form>
      </div>
    </div>
  );
};

export default Session;