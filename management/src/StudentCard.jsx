import React from 'react';

const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='%2394a3b8'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-3.8-.85-5.05-2.2.03-1.68 3.37-2.6 5.05-2.6s5.02.92 5.05 2.6C15.8 19.15 14.03 20 12 20z'/></svg>";

export default function StudentCard({ student, onEdit, onView, onDelete }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Inactive': return 'status-inactive';
      case 'Graduated': return 'status-graduated';
      default: return '';
    }
  };

  const getStatusDotClass = (status) => {
    switch (status) {
      case 'Active': return 'bg-active';
      case 'Inactive': return 'bg-inactive';
      case 'Graduated': return 'bg-graduated';
      default: return '';
    }
  };

  return (
    <div className="student-card" style={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="avatar-wrapper">
            <img
              src={student.photoUrl || DEFAULT_AVATAR}
              alt={student.name}
              className="avatar-img"
              onError={(e) => { e.target.src = DEFAULT_AVATAR; }}
            />
            <span className={`status-indicator ${getStatusDotClass(student.status)}`} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, color: '#ffffff' }}>{student.name}</h3>
            <span style={{ fontSize: '11px', background: '#334155', color: '#38bdf8', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
              🆔 {student.rollNo || 'N/A'}
            </span>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              🎂 {student.age} yrs • {student.gender} • 📅 {student.year}
            </p>
          </div>
        </div>
        <span className={`status-tag ${getStatusClass(student.status)}`}>
          {student.status}
        </span>
      </div>

      <div style={{ marginTop: '16px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px', color: '#cbd5e1' }}>
        <div>📚 <span style={{ fontWeight: 600, color: '#ffffff' }}>{student.course}</span> ({student.department})</div>
        <div>📧 <span style={{ color: '#94a3b8' }}>{student.email}</span></div>
        <div>📞 <span style={{ color: '#94a3b8' }}>{student.phone || 'N/A'}</span></div>
      </div>

      <div className="cgpa-bar" style={{ backgroundColor: '#0f172a', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', margin: '16px 0', fontSize: '13px', fontWeight: 600, border: '1px solid #334155', color: '#cbd5e1' }}>
        <span>📊 Overall CGPA</span>
        <span style={{ color: '#818cf8' }}>{student.cgpa} / 10</span>
      </div>

      <div className="card-actions">
        <button onClick={() => onView(student)} className="btn btn-view">
          👁️ View
        </button>
        <button onClick={() => onEdit(student)} className="btn btn-edit">
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(student.id)} className="btn btn-delete">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}