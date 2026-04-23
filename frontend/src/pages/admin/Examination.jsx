import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // เพิ่มการ import useNavigate
import './Examination.css';
import Sidebar from '../../components/Sidebar';
import { 
  FaSearch, FaPlus, FaEdit, FaTrashAlt 
} from 'react-icons/fa';

const Examination = () => {
  const navigate = useNavigate(); // ประกาศใช้งาน navigate

  // ข้อมูลจำลอง (Mock Data)
  const [institutes, setInstitutes] = useState([
    {
      
    }
  ]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'กำลังเปิดรับสมัครสอบ': return 'status-green';
      case 'เต็มแล้ว': return 'status-orange';
      case 'ระงับการใช้งาน': return 'status-red';
      case 'เปิดให้บริการ': return 'status-light-green';
      default: return 'status-default';
    }
  };

  return (
    <div className="container" style={{ display: 'flex' }}>
      <Sidebar />
      
      <main className="main-content" style={{ marginLeft: '260px', width: '100%' }}>
        <header className="content-header">
          <h1>การจัดการข้อมูลสถานบันที่จัดสอบ</h1>
        </header>

        <section className="table-card">
          <div className="table-controls">
            <div className="search-box">
              <FaSearch />
              <input type="text" placeholder="ค้นหาสถานบันสอบ..." />
            </div>
            <select className="filter-select">
              <option>ตัวกรองสถานะ</option>
            </select>
            <input type="date" className="date-picker" defaultValue="2024-01-01" />
            <button className="btn-add" onClick={() => navigate('/add-examination')}>
  <FaPlus /> เพิ่มสถาบันสอบใหม่
</button>
          </div>

          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>โลโก้สถาบัน</th>
                  <th>ชื่อสถาบันสอบ</th>
                  <th>รหัสสถาบัน</th>
                  <th>ที่อยู่สถาบัน</th>
                  <th>ประเภทสถาบัน</th>
                  <th>ผู้ติดต่อประสานงาน</th>
                  <th>สถานะ</th>
                  <th>วันที่ลงทะเบียน</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {institutes.map((item) => (
                  <tr key={item.id}>
                    <td><img src={item.logo} alt="logo" className="inst-logo" style={{ width: '40px' }} /></td>
                    <td>{item.name}</td>
                    <td>{item.code}</td>
                    <td>{item.address}</td>
                    <td>{item.type}</td>
                    <td>{item.contact}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.regDate}</td>
                    <td className="actions">
                      {/* แก้ไขส่วนนี้: เพิ่ม onClick เพื่อเปลี่ยนหน้า */}
                      <button 
                        className="edit-btn" 
                        onClick={() => navigate(`/edit-examination/${item.id}`)}
                      >
                        <FaEdit />
                      </button>
                      <button className="delete-btn"><FaTrashAlt /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button>ก่อนหน้า</button>
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
            <button>ถัดไป</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Examination;