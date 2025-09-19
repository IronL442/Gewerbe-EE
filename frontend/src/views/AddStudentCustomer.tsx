import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

interface Customer {
  id: number;
  name: string;
  email: string;
}

interface CustomerFormData {
  first_name: string;
  last_name: string
  email: string;
  phone: string;
  address: string;
}

interface StudentFormData {
  customer_id: number | null;
  first_name: string;
  last_name: string;
}

const AddStudentCustomer: React.FC = () => {
  console.log('AddStudentCustomer component is rendering!'); // Debug log
  
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerForm, setCustomerForm] = useState<CustomerFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: ''
  });

  const [studentForm, setStudentForm] = useState<StudentFormData>({
    customer_id: null,
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await api.get<Customer[]>('/api/customers');
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log('Submitting customer form:', customerForm);

    try {
      const { data: newCustomer } = await api.post<Customer>('/api/customers', customerForm);
      console.log('Customer created:', newCustomer);
      setCustomers([...customers, newCustomer]);
      setStudentForm({ ...studentForm, customer_id: newCustomer.id });
      setShowNewCustomerForm(false);
      setCustomerForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
      });
    } catch (error: any) {
      console.error('Error creating customer:', error);
      setError(error.response?.data?.error || 'Failed to create customer');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!studentForm.customer_id) {
      setError('Please select or create a customer first');
      setLoading(false);
      return;
    }

    try {
      await api.post('/api/students', studentForm);
      navigate('/session');
    } catch (error: any) {
      console.error('Error creating student:', error);
      setError(error.response?.data?.error || 'Failed to create student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Neuen Schüler hinzufügen</h1>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Customer Selection */}
              <div className="mb-3">
                <label className="form-label">Kunde (Elternteil) auswählen</label>
                <div className="d-flex gap-2">
                  <select
                    className="form-select flex-grow-1"
                    value={studentForm.customer_id || ''}
                    onChange={(e) =>
                      setStudentForm({
                        ...studentForm,
                        customer_id: e.target.value ? parseInt(e.target.value) : null
                      })
                    }
                  >
                    <option value="">Bestehenden Kunden auswählen...</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} {customer.email ? `(${customer.email})` : ''}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => setShowNewCustomerForm(!showNewCustomerForm)}
                  >
                    {showNewCustomerForm ? 'Abbrechen' : 'Neuer Kunde'}
                  </button>
                </div>
              </div>

              {/* New Customer Form */}
              {showNewCustomerForm && (
                <div className="card mb-3">
                  <div className="card-body bg-light">
                    <h5 className="card-title">Neue Kundendaten</h5>
                    <form onSubmit={handleCustomerSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Vorname *"
                            value={customerForm.first_name}
                            onChange={(e) => setCustomerForm({ ...customerForm, first_name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Nachname *"
                            value={customerForm.last_name}
                            onChange={(e) => setCustomerForm({ ...customerForm, last_name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input
                            type="email"
                            className="form-control"
                            placeholder="E-Mail"
                            value={customerForm.email}
                            onChange={(e) => setCustomerForm({ ...customerForm, email: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <input
                            type="tel"
                            className="form-control"
                            placeholder="Telefon"
                            value={customerForm.phone}
                            onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                          />
                        </div>
                        <div className="col-md-12 mb-3">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Adresse"
                            value={customerForm.address}
                            onChange={(e) => setCustomerForm({ ...customerForm, address: e.target.value })}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={loading}
                      >
                        {loading ? 'Erstelle...' : 'Kunde erstellen'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Student Form */}
              <form onSubmit={handleStudentSubmit}>
                <h5>Schülerdaten</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Vorname *"
                      value={studentForm.first_name}
                      onChange={(e) => setStudentForm({ ...studentForm, first_name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nachname *"
                      value={studentForm.last_name}
                      onChange={(e) => setStudentForm({ ...studentForm, last_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="d-flex gap-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary flex-fill"
                    onClick={() => navigate('/session')}
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-fill"
                    disabled={loading || !studentForm.customer_id}
                  >
                    {loading ? 'Erstelle...' : 'Schüler erstellen'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStudentCustomer;
