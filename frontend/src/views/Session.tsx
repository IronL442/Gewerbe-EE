import React, { useState, useRef, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { api } from '../lib/api';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  customer_id: number;
}

interface Option {
  value: number;
  label: string;
}

const Session: React.FC = () => {
  const navigate = useNavigate();

  // Student select state
  const [students, setStudents] = useState<Option[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Option | null>(null);  // ✅ Fixed type

  // Form fields
  const [date, setDate] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [sessionTopic, setSessionTopic] = useState<string>('');
  const [privacyConsent, setPrivacyConsent] = useState<boolean>(false);

  // Signature canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState<boolean>(false);

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState<boolean>(false);

  // Format date helper function
  const formatDateForPDF = (dateString: string): string => {
    if (!dateString) return 'N/A';
    
    // dateString is in format "yyyy-mm-dd" from HTML date input
    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
  };

  // Fetch students on mount
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get<{students: Student[]}>('/api/students');
        console.log('Students response:', res.data); // Debug log
        
        // Handle the new API response format
        const opts = res.data.students.map((s) => ({ 
          value: s.id, 
          label: s.full_name || `${s.first_name} ${s.last_name}` 
        }));
        
        setStudents(opts);
        console.log('Student options:', opts); // Debug log
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
      }
    }
  }, []);

  // Drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    setHasSignature(true);
    draw(e);
  };

  const stopDrawing = () => {
    setDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
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
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setHasSignature(false);
  };

  // Validate fields
  const validateFields = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedStudent) newErrors['student'] = 'Der Name des Schülers ist erforderlich.';
    if (!date) newErrors['date'] = 'Das Datum ist erforderlich.';
    if (!startTime) newErrors['startTime'] = 'Die Startzeit ist erforderlich.';
    if (!endTime) newErrors['endTime'] = 'Die Endzeit ist erforderlich.';
    if (!sessionTopic) newErrors['sessionTopic'] = 'Das Thema der Stunde ist erforderlich.';
    if (!privacyConsent) newErrors['privacyConsent'] = 'Du musst der Datenschutzrichtlinie zustimmen.';
    if (!hasSignature) newErrors['signature'] = 'Unterschrift ist erforderlich.';
    return newErrors;
  };

  // Create PDF
  const createPDF = async (): Promise<Blob> => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.text('Sitzungsprotokoll', 10, 20);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(12);
    pdf.text(`Schüler: ${selectedStudent?.label || 'N/A'}`, 10, 40);
    pdf.text(`Datum: ${formatDateForPDF(date)}`, 10, 50);
    pdf.text(`Startzeit: ${startTime}`, 10, 60);
    pdf.text(`Endzeit: ${endTime}`, 10, 70);
    pdf.text(`Thema: ${sessionTopic}`, 10, 80);

    // Timestamp
    const timestamp = new Intl.DateTimeFormat('de-DE', {
      timeZone: 'Europe/Berlin',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());
    pdf.text(`Erstellt am: ${timestamp}`, 10, 130);

    // Signature
    if (canvasRef.current) {
      const img = canvasRef.current.toDataURL('image/png');
      pdf.addImage(img, 'PNG', 35, 85, 50, 25);
    } else {
      pdf.text('Unterschrift: Nicht vorhanden', 10, 110);
    }

    return pdf.output('blob');
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateFields();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setShowErrors(true);
      return;
    }
    setErrors({});
    setShowErrors(false);

    try {
      const pdfBlob = await createPDF();
      const formData = new FormData();
      formData.append('student_id', selectedStudent?.value.toString() || '');
      formData.append('date', date);
      formData.append('start_time', startTime);
      formData.append('end_time', endTime);
      formData.append('session_topic', sessionTopic);
      formData.append('pdf', pdfBlob);
      formData.append('signature_present', hasSignature ? 'true' : 'false');

      const response = await api.post('/api/session', formData);

      if (response.status === 200) {
        // reset form
        setSelectedStudent(null);
        setDate('');
        setStartTime('');
        setEndTime('');
        setSessionTopic('');
        clearSignature();
        setPrivacyConsent(false);
      }
    } catch (err: any) {
      setErrors({ general: err.response?.data?.error || 'Failed to log session' });
      setShowErrors(true);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Neuen Termin eintragen</h1>
      {errors.general && <div className="alert alert-danger">{errors.general}</div>}

      <form onSubmit={handleSubmit} noValidate>
        {/* Student select */}
        <div className="mb-3">
          <label htmlFor="studentSelect" className="form-label">Schüler</label>
          <div className='d-flex mb-2'>
          <Select
            inputId="studentSelect"
            options={students}
            value={selectedStudent}
            onChange={(opt: SingleValue<Option>) => setSelectedStudent(opt)}
            placeholder="Name eingeben..."
            classNamePrefix={showErrors && errors.student ? 'is-invalid' : undefined}
            className="flex-grow-1"
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => navigate('/add-student-customer')}
          >
            Neuen Schüler/Kunde hinzufügen
          </button>
        </div>
        {showErrors && errors.student && (
            <div className="invalid-feedback d-block">{errors.student}</div>
          )}
        </div>

        {/* Date, start/end time, topic */}
        {[
          { label: 'Datum', value: date, setter: setDate, id: 'date', type: 'date' },
          { label: 'Startzeit', value: startTime, setter: setStartTime, id: 'startTime', type: 'time' },
          { label: 'Endzeit', value: endTime, setter: setEndTime, id: 'endTime', type: 'time' },
          { label: 'Thema der Stunde', value: sessionTopic, setter: setSessionTopic, id: 'sessionTopic' }
        ].map(({ label, value, setter, id, type }) => (
          <div className="mb-3" key={id}>
            <label htmlFor={id} className="form-label">{label}</label>
            <input
              id={id}
              type={type || 'text'}  // ✅ Added fallback
              className={`form-control ${showErrors && errors[id] ? 'is-invalid' : ''}`}
              value={value}
              onChange={(e) => setter(e.target.value)}
            />
            {showErrors && errors[id] && (
              <div className="invalid-feedback">{errors[id]}</div>
            )}
          </div>
        ))}

        {/* Privacy consent */}
        <div className="form-check mb-3 d-flex justify-content-center align-items-center">
          <input
            id="privacyConsent"
            type="checkbox"
            className="form-check-input position-static me-2"
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
          />
          <label htmlFor="privacyConsent" className="form-check-label mb-0">
            Ich habe die <a href="/privacy" target="_blank" rel="noopener noreferrer">Datenschutzbestimmungen</a> gelesen und stimme ihnen zu.
          </label>
          {showErrors && errors.privacyConsent && (
            <div className="text-danger">{errors.privacyConsent}</div>
          )}
        </div>

        {/* Signature pad */}
        <h2>Hier unterschreiben</h2>
        <canvas
          ref={canvasRef}
          width={400}
          height={200}
          className={`signature-pad border ${showErrors && errors.signature ? 'border-danger' : ''}`}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
        />
        {showErrors && errors.signature && (
          <div className="text-danger mt-2">{errors.signature}</div>
        )}

        {/* Buttons */}
        <button type="submit" className="btn btn-success">Termin speichern</button>
        <button type="button" className="btn btn-secondary ms-2" onClick={clearSignature}>Unterschrift löschen</button>
      </form>
    </div>
  );
};

export default Session;
