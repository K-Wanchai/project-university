import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Money.css';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const API_URL = "http://localhost:8080/api/admin/payments";

function Money() {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State สำหรับการค้นหาและตัวกรอง
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState(''); // รอตรวจสอบ, อนุมัติแล้ว, ปฏิเสธ

  useEffect(() => {
    fetchPayments();
  }, []);

  // ดึงข้อมูลการชำระเงินจาก API
  const fetchPayments = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลการชำระเงินได้");
      }
      const data = await response.json();
      setPayments(data); 
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      
      // Mock Data สำหรับทดสอบ UI กรณีที่ API ยังไม่พร้อมใช้งาน
      setPayments([
        { id: 1, studentName: 'ด.ช. ตั้งใจ เรียนดี', courseName: 'คณิตศาสตร์ ม.ปลาย', amount: 1500, date: '24-05-2026', status: 'รอตรวจสอบ', slipUrl: 'mock-slip1.jpg' },
        { id: 2, studentName: 'ด.ญ. สมศรี สุขใจ', courseName: 'ภาษาอังกฤษ ม.ต้น', amount: 2000, date: '23-05-2026', status: 'อนุมัติแล้ว', slipUrl: 'mock-slip2.jpg' },
        { id: 3, studentName: 'นาย ขยัน หมั่นเพียร', courseName: 'ฟิสิกส์ ม.6', amount: 1800, date: '22-05-2026', status: 'ปฏิเสธ', slipUrl: 'mock-slip3.jpg' }
      ]);
      setIsLoading(false); // ปิด loading เมื่อใช้ mock data
    } finally {
      // setIsLoading(false); // เปิดใช้งานบรรทัดนี้เมื่อต่อ API จริงสำเร็จ
    }
  };

  // ฟังก์ชันอัปเดตสถานะ (อนุมัติ / ปฏิเสธ)
  const handleUpdateStatus = async (id, newStatus) => {
    const actionText = newStatus === 'อนุมัติแล้ว' ? 'อนุมัติ' : 'ปฏิเสธ';
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการ ${actionText} รายการนี้?`)) {
      try {
        // ตัวอย่างการส่ง Request ไปอัปเดตข้อมูลจริง
        /*
        const response = await fetch(`${API_URL}/${id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) throw new Error("เกิดข้อผิดพลาด");
        */
        
        // อัปเดต State ทันทีเพื่อให้ UI เปลี่ยนแปลง (Optimistic UI Update)
        setPayments(payments.map(payment => 
          payment.id === id ? { ...payment, status: newStatus } : payment
        ));
        alert(`${actionText}รายการเรียบร้อยแล้ว`);
      } catch (err) {
        console.error(err);
        alert("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
      }
    }
  };

  const getStatusClass = (statusText) => {
    if (statusText === 'อนุมัติแล้ว') return 'status-approved';
    if (statusText === 'รอตรวจสอบ') return 'status-pending';
    return 'status-rejected'; 
  };

  const getDotClass = (statusText) => {
    if (statusText === 'อนุมัติแล้ว') return 'dot-green';
    if (statusText === 'รอตรวจสอบ') return 'dot-yellow';
    return 'dot-red';
  };

  // กรองข้อมูลด้วย ชื่อนักเรียน, ชื่อคอร์ส และสถานะ
  const filteredPayments = payments.filter(payment => {
    const searchMatch = payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        payment.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === '' || payment.status === filterStatus;
    
    return searchMatch && statusMatch;
  });

  return (
    <div className="container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      
      <Sidebar />
      
      <main className="main-content" style={{ flex: 1, marginLeft: '260px', padding: '30px', overflowX: 'hidden' }}>
        
        <Header title="ยืนยันการชำระเงิน" /><br />
        <div className="info-bar" style={{ marginBottom: '20px', color: '#64748b' }}>
          ข้อมูลระบบ : : ตรวจสอบและยืนยันสลิปโอนเงิน
        </div>

        <div className="filter-section" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <input 
            type="text" 
            className="search-input" 
            placeholder="ค้นหาชื่อนักเรียน หรือ คอร์สเรียน..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', flex: 1 }} 
          />
          <select 
            className="filter-select" 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          >
            <option value="">สถานะทั้งหมด</option>
            <option value="รอตรวจสอบ">รอตรวจสอบ</option>
            <option value="อนุมัติแล้ว">อนุมัติแล้ว</option>
            <option value="ปฏิเสธ">ปฏิเสธ</option>
          </select>
        </div>

        <section className="money-card" style={{ background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>รายการแจ้งชำระเงิน</h3>
          
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>กำลังโหลดข้อมูล...</div>
          ) : error && payments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>{error}</div>
          ) : (
            <table className="money-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px' }}>#</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>สลิปหลักฐาน</th>
                  <th style={{ padding: '12px' }}>ชื่อนักเรียน</th>
                  <th style={{ padding: '12px' }}>คอร์สเรียน</th>
                  <th style={{ padding: '12px' }}>วันที่ชำระ</th>
                  <th style={{ padding: '12px' }}>จำนวนเงิน (฿)</th>
                  <th style={{ padding: '12px' }}>สถานะ</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>ไม่พบรายการแจ้งชำระเงิน</td>
                  </tr>
                ) : (
                  filteredPayments.map((payment, index) => (
                    <tr key={payment.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px' }}>{index + 1}</td>
                      <td className="slip-icon" style={{ padding: '12px', textAlign: 'center' }}>
                        {payment.slipUrl && payment.slipUrl.trim() !== '' ? (
                           <div className="slip-thumbnail" onClick={() => alert('ฟังก์ชันขยายดูสลิป')}>
                             <i className="fas fa-file-invoice-dollar" style={{ fontSize: '24px', color: '#94a3b8', cursor: 'pointer' }}></i>
                           </div>
                        ) : (
                           <span style={{ fontSize: '14px', color: '#cbd5e1' }}>ไม่มีไฟล์</span>
                        )}
                      </td>
                      <td style={{ padding: '12px' }}><strong>{payment.studentName}</strong></td>
                      <td style={{ padding: '12px' }}>{payment.courseName}</td>
                      <td style={{ padding: '12px' }}>{payment.date}</td>
                      <td style={{ padding: '12px', fontWeight: 'bold', color: '#0f172a' }}>
                        {payment.amount.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span className={`status-pill ${getStatusClass(payment.status)}`}>
                          <span className={`dot ${getDotClass(payment.status)}`}></span>
                          {payment.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        {payment.status === 'รอตรวจสอบ' ? (
                          <>
                            <button className="btn-approve" onClick={() => handleUpdateStatus(payment.id, 'อนุมัติแล้ว')}>
                              <i className="fas fa-check"></i> อนุมัติ
                            </button>
                            <button className="btn-reject" onClick={() => handleUpdateStatus(payment.id, 'ปฏิเสธ')}>
                              <i className="fas fa-times"></i> ปฏิเสธ
                            </button>
                          </>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '14px' }}>ดำเนินการแล้ว</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </section>

      </main>
    </div>
  );
}

export default Money;