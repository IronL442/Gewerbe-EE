import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const [showErrors, setShowErrors] = useState(false);

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

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    if (!studentName) newErrors["studentName"] = "Der Name des Schülers ist erforderlich.";
    if (!date) newErrors["date"] = "Das Datum ist erforderlich.";
    if (!startTime) newErrors["startTime"] = "Die Startzeit ist erforderlich.";
    if (!endTime) newErrors["endTime"] = "Die Endzeit ist erforderlich.";
    if (!sessionTopic) newErrors["sessionTopic"] = "Das Thema der Stunde ist erforderlich.";
    if (!privacyConsent) newErrors["privacyConsent"] = "Du musst der Datenschutzrichtlinie zustimmen.";
    if (!hasSignature) newErrors["signature"] = "Unterschrift ist erforderlich.";

    return newErrors;
  };

  const createPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
  
    // Set font
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Sitzungsprotokoll", 10, 20);
  
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);
  
    // Add session details
    pdf.text(`Schüler: ${studentName}`, 10, 40);
    pdf.text(`Datum: ${date}`, 10, 50);
    pdf.text(`Startzeit: ${startTime}`, 10, 60);
    pdf.text(`Endzeit: ${endTime}`, 10, 70);
    pdf.text(`Thema: ${sessionTopic}`, 10, 80);
    pdf.text(`Unterschrift: `, 10, 90);
    
    // Timestamp to prevent tampering
    const timestamp = new Intl.DateTimeFormat("de-DE", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());
    pdf.text(`Erstellt am: ${timestamp}`, 10, 130);
  
    // Get signature from canvas and add to PDF
    if (canvasRef.current) {
      const signatureDataUrl = canvasRef.current.toDataURL("image/png");
      pdf.addImage(signatureDataUrl, "PNG", 35, 85, 50, 25); // Adjust size & position as needed
    } else {
      pdf.text("Unterschrift: Nicht vorhanden", 10, 110);
    }
  
    return pdf.output("blob");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateFields();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShowErrors(true);
      return;
    }

    setErrors({});
    setShowErrors(false);

    // Prevent error message from showing up on PDF
    await new Promise((resolve) => setTimeout(resolve,0));

    try {
      const pdfBlob = await createPDF();

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
        <h1>Neuen Termin eintragen</h1>
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        
        <form onSubmit={handleSubmit} noValidate>
          {[
            { label: "Schüler", value: studentName, setValue: setStudentName, id: "studentName" },
            { label: "Datum", value: date, setValue: setDate, id: "date", type: "date" },
            { label: "Start Zeit", value: startTime, setValue: setStartTime, id: "startTime", type: "time" },
            { label: "End Zeit", value: endTime, setValue: setEndTime, id: "endTime", type: "time" },
            { label: "Thema der Stunde", value: sessionTopic, setValue: setSessionTopic, id: "sessionTopic" }
          ].map(({ label, value, setValue, id, type = "text" }) => (
            <div className="mb-3" key={id}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                className={`form-control ${showErrors && errors[id] ? "is-invalid" : ""}`}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                aria-invalid={!!errors[id]}
                aria-describedby={`${id}Error`}
              />
              {showErrors && errors[id] && <div id={`${id}Error`} className="invalid-feedback">{errors[id]}</div>}
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
              Ich habe die{" "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer">Datenschutzbestimmungen</a> gelesen und stimme ihnen zu.
            </label>
            {showErrors && errors.privacyConsent && <div className="text-danger">{errors.privacyConsent}</div>}
          </div>

          <h2>Hier unterschreiben</h2>
          <canvas
            className={`signature-pad border ${showErrors && errors.signature ? "border-danger" : ""}`}
            width={400}
            height={200}
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
          />
          {showErrors && errors.signature && <div className="text-danger mt-2">{errors.signature}</div>}

          <button type="submit" className="btn btn-success">Termin speichern</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={clearSignature}>Unterschrift löschen</button>
        </form>
      </div>
    </div>
  );
};

export default Session;