import React, { useState } from 'react';
import './index.css';
import StudentCard from './StudentCard';

const INITIAL_STUDENTS = [
  {
    id: '1',
    rollNo: '24CS001',
    name: 'Karthik Raja',
    age: 21,
    gender: 'Male',
    phone: '+91 9876543210',
    course: 'B.E Computer Science',
    department: 'CSE',
    email: 'karthik@example.com',
    cgpa: '8.7',
    year: '4th Year',
    status: 'Active',
    photoUrl: '',
  },
  {
    id: '2',
    rollNo: '24IT015',
    name: 'Ananya Sharma',
    age: 20,
    gender: 'Female',
    phone: '+91 9812345678',
    course: 'B.Tech Information Technology',
    department: 'IT',
    email: 'ananya@example.com',
    cgpa: '9.2',
    year: '3rd Year',
    status: 'Active',
    photoUrl: '',
  },
  {
    id: '3',
    rollNo: '23EC042',
    name: 'Suresh Kumar',
    age: 22,
    gender: 'Male',
    phone: '+91 9765432109',
    course: 'B.E Electronics & Comm.',
    department: 'ECE',
    email: 'suresh@example.com',
    cgpa: '7.8',
    year: '4th Year',
    status: 'Graduated',
    photoUrl: '',
  },
  {
    id: '4',
    rollNo: '24CS015',
    name: 'Anitha',
    age: 20,
    gender: 'Female',
    phone: '+91 9812345678',
    course: 'B.E Computer Science and Engineering',
    department: 'CSE',
    email: 'anitha@example.com',
    cgpa: '7.9',
    year: '3rd Year',
    status: 'Active',
    photoUrl: '',
  },
];

export default function App() {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: '', rollNo: '', name: '', age: '', gender: 'Male', phone: '', course: '', department: 'CSE', email: '', cgpa: '', year: '1st Year', status: 'Active', photoUrl: ''
  });

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'Active').length;
  const avgCgpa = (students.reduce((acc, curr) => acc + parseFloat(curr.cgpa || 0), 0) / (totalStudents || 1)).toFixed(2);

  const exportToCSV = () => {
    const headers = ["ID,RollNo,Name,Age,Gender,Phone,Course,Department,Email,CGPA,Year,Status\n"];
    const rows = students.map(s => `"${s.id}","${s.rollNo}","${s.name}","${s.age}","${s.gender}","${s.phone}","${s.course}","${s.department}","${s.email}","${s.cgpa}","${s.year}","${s.status}"\n`);
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Student_Report_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setFormData({ id: Date.now().toString(), rollNo: '', name: '', age: '', gender: 'Male', phone: '', course: '', department: 'CSE', email: '', cgpa: '', year: '1st Year', status: 'Active', photoUrl: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (student) => {
    setIsEditing(true);
    setFormData(student);
    setIsModalOpen(true);
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setStudents(students.map((s) => (s.id === formData.id ? formData : s)));
    } else {
      setStudents([formData, ...students]);
    }
    setIsModalOpen(false);
  };

  const processedStudents = students
    .filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (s.rollNo && s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesDept = selectedDept === 'All' || s.department === selectedDept;
      const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;
      return matchesSearch && matchesDept && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'cgpa-high') return parseFloat(b.cgpa) - parseFloat(a.cgpa);
      if (sortBy === 'cgpa-low') return parseFloat(a.cgpa) - parseFloat(b.cgpa);
      return a.name.localeCompare(b.name);
    });

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#ffffff' }}>
      <header className="app-header">
        <div>
          <h1 className="header-title">🎓 Student Portal Dashboard</h1>
          <p className="header-subtitle">Manage records, monitor academic metrics, and track profiles</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn" style={{ background: '#334155', color: '#fff', border: '1px solid #475569' }} onClick={exportToCSV}>
            📥 Export CSV
          </button>
          <button className="btn-primary" onClick={handleOpenAddModal}>
            + Add New Student
          </button>
        </div>
      </header>

      <main className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{totalStudents}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active Enrollment</div>
            <div className="stat-value" style={{ color: '#4ade80' }}>{activeStudents}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Average CGPA</div>
            <div className="stat-value" style={{ color: '#38bdf8' }}>{avgCgpa}</div>
          </div>
        </div>

        <div className="controls-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search name, email, or Roll No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select className="select-input" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
          </select>
          <select className="select-input" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>
          <select className="select-input" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="cgpa-high">Sort by CGPA (High to Low)</option>
            <option value="cgpa-low">Sort by CGPA (Low to High)</option>
          </select>
        </div>

        <div className="cards-grid">
          {processedStudents.length > 0 ? (
            processedStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#94a3b8', padding: '40px 0' }}>
              No students found matching the criteria.
            </p>
          )}
        </div>
      </main>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsModalOpen(false)}>✖</button>
            <h3 style={{ margin: '0 0 20px 0' }}>{isEditing ? '✏️ Edit Student' : '➕ Add New Student'}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Roll / Reg No</label>
                  <input type="text" required placeholder="e.g. 24CS001" value={formData.rollNo} onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" required value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" required placeholder="+91..." value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>
                  <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Academic Year</label>
                  <select value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Degree / Course</label>
                  <input type="text" required value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>CGPA</label>
                  <input type="text" required value={formData.cgpa} onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Photo URL (Optional)</label>
                  <input type="text" placeholder="https://..." value={formData.photoUrl} onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Save Changes' : 'Create Record'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setIsViewModalOpen(false)}>✖</button>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={selectedStudent.photoUrl || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%2394a3b8'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-3.8-.85-5.05-2.2.03-1.68 3.37-2.6 5.05-2.6s5.02.92 5.05 2.6C15.8 19.15 14.03 20 12 20z'/></svg>"}
                alt={selectedStudent.name}
                style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <h3 style={{ margin: '8px 0 0 0' }}>{selectedStudent.name}</h3>
              <p style={{ fontSize: '13px', color: '#38bdf8', margin: '4px 0', fontWeight: 'bold' }}>Reg No: {selectedStudent.rollNo || 'N/A'}</p>
            </div>
            <div style={{ fontSize: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div><strong>Course:</strong> {selectedStudent.course}</div>
              <div><strong>Department:</strong> {selectedStudent.department}</div>
              <div><strong>Academic Year:</strong> {selectedStudent.year}</div>
              <div><strong>Gender:</strong> {selectedStudent.gender}</div>
              <div><strong>Age:</strong> {selectedStudent.age} yrs</div>
              <div><strong>CGPA:</strong> {selectedStudent.cgpa} / 10</div>
              <div><strong>Email:</strong> {selectedStudent.email}</div>
              <div><strong>Phone:</strong> {selectedStudent.phone || 'N/A'}</div>
              <div><strong>Status:</strong> {selectedStudent.status}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}