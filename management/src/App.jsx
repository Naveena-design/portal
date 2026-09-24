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

const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%2394a3b8'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-3.8-.85-5.05-2.2.03-1.68 3.37-2.6 5.05-2.6s5.02.92 5.05 2.6C15.8 19.15 14.03 20 12 20z'/></svg>";

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
    id: '',
    rollNo: '',
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    course: '',
    department: 'CSE',
    email: '',
    cgpa: '',
    year: '1st Year',
    status: 'Active',
    photoUrl: '',
  });

  const totalStudents = students.length;

  const activeStudents = students.filter(
    (student) => student.status === 'Active'
  ).length;

  const avgCgpa = (
    students.reduce(
      (total, student) => total + parseFloat(student.cgpa || 0),
      0
    ) / (totalStudents || 1)
  ).toFixed(2);

  const exportToCSV = () => {
    const headers =
      'ID,RollNo,Name,Age,Gender,Phone,Course,Department,Email,CGPA,Year,Status\n';

    const rows = students
      .map(
        (student) =>
          `"${student.id}","${student.rollNo}","${student.name}","${student.age}","${student.gender}","${student.phone}","${student.course}","${student.department}","${student.email}","${student.cgpa}","${student.year}","${student.status}"\n`
      )
      .join('');

    const blob = new Blob([headers, rows], {
      type: 'text/csv',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = `Student_Report_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();

    window.URL.revokeObjectURL(url);
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);

    setFormData({
      id: Date.now().toString(),
      rollNo: '',
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      course: '',
      department: 'CSE',
      email: '',
      cgpa: '',
      year: '1st Year',
      status: 'Active',
      photoUrl: '',
    });

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
      setStudents(
        students.filter((student) => student.id !== id)
      );
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (isEditing) {
      setStudents(
        students.map((student) =>
          student.id === formData.id ? formData : student
        )
      );
    } else {
      setStudents([formData, ...students]);
    }

    setIsModalOpen(false);
  };

  const processedStudents = students
    .filter((student) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        (student.rollNo &&
          student.rollNo.toLowerCase().includes(search));

      const matchesDepartment =
        selectedDept === 'All' ||
        student.department === selectedDept;

      const matchesStatus =
        selectedStatus === 'All' ||
        student.status === selectedStatus;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    })
    .sort((a, b) => {
      if (sortBy === 'cgpa-high') {
        return parseFloat(b.cgpa) - parseFloat(a.cgpa);
      }

      if (sortBy === 'cgpa-low') {
        return parseFloat(a.cgpa) - parseFloat(b.cgpa);
      }

      return a.name.localeCompare(b.name);
    });

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1 className="header-title">
            🎓 Student Portal Dashboard
          </h1>

          <p className="header-subtitle">
            Manage records, monitor academic metrics, and track profiles
          </p>
        </div>

        <div className="header-actions">
          <button
            className="export-btn"
            onClick={exportToCSV}
          >
            📥 Export CSV
          </button>

          <button
            className="btn-primary"
            onClick={handleOpenAddModal}
          >
            + Add New Student
          </button>
        </div>
      </header>

      <main className="container">
        <div className="stats-grid">
          <div className="stat-card stat-total">
            <div className="stat-label">
              Total Students
            </div>

            <div className="stat-value">
              {totalStudents}
            </div>
          </div>

          <div className="stat-card stat-active">
            <div className="stat-label">
              Active Enrollment
            </div>

            <div className="stat-value">
              {activeStudents}
            </div>
          </div>

          <div className="stat-card stat-cgpa">
            <div className="stat-label">
              Average CGPA
            </div>

            <div className="stat-value">
              {avgCgpa}
            </div>
          </div>
        </div>

        <div className="controls-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search name, email, or Roll No..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          <select
            className="select-input"
            value={selectedDept}
            onChange={(event) =>
              setSelectedDept(event.target.value)
            }
          >
            <option value="All">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
          </select>

          <select
            className="select-input"
            value={selectedStatus}
            onChange={(event) =>
              setSelectedStatus(event.target.value)
            }
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Graduated">Graduated</option>
          </select>

          <select
            className="select-input"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value)
            }
          >
            <option value="name">Sort by Name</option>
            <option value="cgpa-high">
              Sort by CGPA (High to Low)
            </option>
            <option value="cgpa-low">
              Sort by CGPA (Low to High)
            </option>
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
            <p className="no-students">
              No students found matching the criteria.
            </p>
          )}
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="close-btn"
              onClick={() => setIsModalOpen(false)}
            >
              ✖
            </button>

            <h3 className="modal-title">
              {isEditing
                ? '✏️ Edit Student'
                : '➕ Add New Student'}
            </h3>

            <form onSubmit={handleFormSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Roll / Reg No</label>

                  <input
                    type="text"
                    required
                    placeholder="e.g. 24CS001"
                    value={formData.rollNo}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        rollNo: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        name: event.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Age</label>

                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        age: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Gender</label>

                  <select
                    value={formData.gender}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        gender: event.target.value,
                      })
                    }
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>

                  <input
                    type="text"
                    required
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        phone: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>

                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        email: event.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department</label>

                  <select
                    value={formData.department}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        department: event.target.value,
                      })
                    }
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Academic Year</label>

                  <select
                    value={formData.year}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        year: event.target.value,
                      })
                    }
                  >
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

                  <input
                    type="text"
                    required
                    value={formData.course}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        course: event.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>CGPA</label>

                  <input
                    type="text"
                    required
                    value={formData.cgpa}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        cgpa: event.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>

                  <select
                    value={formData.status}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        status: event.target.value,
                      })
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Photo URL</label>

                  <input
                    type="text"
                    placeholder="https://..."
                    value={formData.photoUrl}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        photoUrl: event.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-cancel"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary modal-save"
                >
                  {isEditing
                    ? 'Save Changes'
                    : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedStudent && (
        <div className="modal-overlay">
          <div className="modal-content view-modal">
            <button
              className="close-btn"
              onClick={() => setIsViewModalOpen(false)}
            >
              ✖
            </button>

            <div className="view-profile">
              <img
                src={
                  selectedStudent.photoUrl ||
                  DEFAULT_AVATAR
                }
                alt={selectedStudent.name}
                className="view-avatar"
              />

              <h3>{selectedStudent.name}</h3>

              <p>
                Reg No: {selectedStudent.rollNo || 'N/A'}
              </p>
            </div>

            <div className="view-details">
              <div>
                <strong>Course</strong>
                <span>{selectedStudent.course}</span>
              </div>

              <div>
                <strong>Department</strong>
                <span>{selectedStudent.department}</span>
              </div>

              <div>
                <strong>Academic Year</strong>
                <span>{selectedStudent.year}</span>
              </div>

              <div>
                <strong>Gender</strong>
                <span>{selectedStudent.gender}</span>
              </div>

              <div>
                <strong>Age</strong>
                <span>{selectedStudent.age} yrs</span>
              </div>

              <div>
                <strong>CGPA</strong>
                <span>{selectedStudent.cgpa} / 10</span>
              </div>

              <div>
                <strong>Email</strong>
                <span>{selectedStudent.email}</span>
              </div>

              <div>
                <strong>Phone</strong>
                <span>{selectedStudent.phone || 'N/A'}</span>
              </div>

              <div>
                <strong>Status</strong>
                <span>{selectedStudent.status}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}