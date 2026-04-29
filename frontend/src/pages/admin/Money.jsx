import React, { useEffect, useState } from 'react';
import './Money.css';
import AdminLayout from '../../Layout/AdminLayout';

function Money() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminRemark, setAdminRemark] = useState('');

  useEffect(() => {
    setPayments([
      {
        id: 1,
        studentName: 'ด.ช. ตั้งใจ เรียนดี',
        studentId: 'KP-001',
        profileUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        courseName: 'คณิตศาสตร์ ม.ปลาย',
        courseId: 'M4-MATH',
        amount: 1500,
        date: '24-05-2026',
        status: 'WAIT_VERIFY',
        method: 'โอนเงินผ่านธนาคาร (e-wallet)',
        slipUrl: 'https://i.pinimg.com/736x/8f/3e/36/8f3e36e392ef4f1d4ba7ad40b3c5885c.jpg',
      },
      {
        id: 2,
        studentName: 'ด.ญ. สมศรี สุขใจ',
        studentId: 'KP-002',
        profileUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
        courseName: 'ภาษาอังกฤษ ม.ต้น',
        courseId: 'E3-ENG',
        amount: 2000,
        date: '23-05-2026',
        status: 'APPROVED',
        method: 'โอนเงินผ่านธนาคาร',
        slipUrl: '',
      },
      {
        id: 3,
        studentName: 'นาย ขยัน หมั่นเพียร',
        studentId: 'KP-003',
        profileUrl: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        courseName: 'ฟิสิกส์ ม.6',
        courseId: 'P6-PHY',
        amount: 1800,
        date: '22-05-2026',
        status: 'REJECTED',
        method: 'โอนเงินผ่านธนาคาร',
        slipUrl: '',
      },
    ]);
  }, []);

  const getStatusText = (status) => {
    if (status === 'WAIT_VERIFY') return 'รอตรวจสอบ';
    if (status === 'APPROVED') return 'อนุมัติแล้ว';
    if (status === 'REJECTED') return 'ปฏิเสธ';
    return '-';
  };

  const getStatusClass = (status) => {
    if (status === 'WAIT_VERIFY') return 'status-pending';
    if (status === 'APPROVED') return 'status-approved';
    if (status === 'REJECTED') return 'status-rejected';
    return '';
  };

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setAdminRemark('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
    setAdminRemark('');
  };

  const updateStatus = (status) => {
    if (!selectedPayment) return;

    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === selectedPayment.id ? { ...payment, status } : payment
      )
    );

    alert(`อัปเดตสถานะเป็น "${getStatusText(status)}" เรียบร้อยแล้ว`);
    closeModal();
  };

  const filteredPayments = payments.filter((payment) => {
    const keyword = searchTerm.trim().toLowerCase();
    const searchableText = `
      ${payment.studentName}
      ${payment.studentId}
      ${payment.courseName}
      ${payment.courseId}
    `.toLowerCase();

    const matchKeyword = searchableText.includes(keyword);
    const matchStatus = filterStatus === '' || payment.status === filterStatus;

    return matchKeyword && matchStatus;
  });

  return (
    <AdminLayout>

      <div className="breadcrumb">
        ข้อมูลระบบ : ตรวจสอบสลิปยืนยันการโอนเงิน
      </div>

      <section className="filter-section">
        <div className="search-box">
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder="ค้นหาชื่อนักเรียน รหัสนักเรียน หรือคอร์สเรียน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">สถานะทั้งหมด</option>
          <option value="WAIT_VERIFY">รอตรวจสอบ</option>
          <option value="APPROVED">อนุมัติแล้ว</option>
          <option value="REJECTED">ปฏิเสธ</option>
        </select>
      </section>

      <section className="money-card">
        <div className="card-header">
          <div>
            <h3>รายการแจ้งชำระเงิน</h3>
            <p>ตรวจสอบรายการโอนเงินและจัดการสถานะการชำระเงิน</p>
          </div>

          <div className="total-pill">
            {filteredPayments.length} รายการ
          </div>
        </div>

        <div className="table-wrap">
          <table className="money-table">
            <thead>
              <tr>
                <th className="td-center">#</th>
                <th>ชื่อนักเรียน</th>
                <th>คอร์สเรียน</th>
                <th className="td-center">วันที่ชำระ</th>
                <th className="td-center">จำนวนเงิน</th>
                <th className="td-center">สถานะ</th>
                <th className="td-center">การจัดการ</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr key={payment.id}>
                  <td className="td-center">{index + 1}</td>

                  <td>
                    <div className="student-cell">
                      <img src={payment.profileUrl} alt={payment.studentName} />
                      <div>
                        <strong>{payment.studentName}</strong>
                        <span>{payment.studentId}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="course-cell">
                      <strong>{payment.courseName}</strong>
                      <span>{payment.courseId}</span>
                    </div>
                  </td>

                  <td className="td-center">{payment.date}</td>

                  <td className="td-center money-amount">
                    ฿{payment.amount.toLocaleString()}
                  </td>

                  <td className="td-center">
                    <span className={`status-badge ${getStatusClass(payment.status)}`}>
                      <span className="status-dot" />
                      {getStatusText(payment.status)}
                    </span>
                  </td>

                  <td className="td-center">
                    <button
                      type="button"
                      className="btn-view"
                      onClick={() => openModal(payment)}
                    >
                      <span>👁️</span>
                      ตรวจสอบ
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="7">
                    <div className="empty-state">
                      ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && selectedPayment && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-kicker">Payment Verification</span>
                <h2>ตรวจสอบรายละเอียดการชำระเงิน</h2>
                <p>{selectedPayment.studentName}</p>
              </div>

              <button
                type="button"
                className="modal-x"
                onClick={closeModal}
                aria-label="close"
              >
                ×
              </button>
            </div>

            <div className="modal-grid">
              <div className="modal-left">
                <div className="info-card">
                  <h4>ข้อมูลนักเรียน</h4>
                  <div className="profile-box">
                    <img src={selectedPayment.profileUrl} alt={selectedPayment.studentName} />
                    <div>
                      <strong>{selectedPayment.studentName}</strong>
                      <span>{selectedPayment.studentId}</span>
                    </div>
                  </div>
                </div>

                <div className="info-card">
                  <h4>ข้อมูลคอร์สเรียน</h4>
                  <InfoRow label="ชื่อคอร์ส" value={selectedPayment.courseName} />
                  <InfoRow label="รหัสคอร์ส" value={selectedPayment.courseId} />
                  <InfoRow
                    label="ราคาคอร์ส"
                    value={`${selectedPayment.amount.toLocaleString()} ฿`}
                  />
                </div>

                <div className="info-card">
                  <h4>รายละเอียดการชำระเงิน</h4>
                  <InfoRow
                    label="จำนวนเงินที่แจ้ง"
                    value={`${selectedPayment.amount.toLocaleString()} ฿`}
                    strong
                  />
                  <InfoRow label="วันที่ชำระ" value={selectedPayment.date} />
                  <InfoRow label="วิธีการชำระ" value={selectedPayment.method} />
                  <InfoRow
                    label="สถานะปัจจุบัน"
                    value={getStatusText(selectedPayment.status)}
                  />
                </div>
              </div>

              <div className="modal-right">
                <div className="info-card">
                  <h4>หลักฐานการชำระเงิน</h4>
                  <div className="slip-box">
                    {selectedPayment.slipUrl ? (
                      <img
                        src={selectedPayment.slipUrl}
                        alt="Slip"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('slip-error');
                        }}
                      />
                    ) : (
                      <div className="no-slip">ไม่มีรูปสลิป</div>
                    )}
                  </div>
                </div>

                <div className="info-card">
                  <h4>ความคิดเห็น / หมายเหตุ</h4>
                  <textarea
                    className="remark-textarea"
                    placeholder="กรอกความคิดเห็นของคุณ..."
                    value={adminRemark}
                    onChange={(e) => setAdminRemark(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer-custom">
              <div className="footer-left">
                <div className="action-buttons">
                  <button
                    type="button"
                    className="btn-approve"
                    onClick={() => updateStatus('APPROVED')}
                  >
                    ✔ อนุมัติการชำระ
                  </button>

                  <button
                    type="button"
                    className="btn-reject"
                    onClick={() => updateStatus('REJECTED')}
                  >
                    ✖ ปฏิเสธการชำระ
                  </button>
                </div>
              </div>

              <div className="footer-right">
                <button
                  type="button"
                  className="btn-close-gray"
                  onClick={closeModal}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function InfoRow({ label, value, strong }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <strong className={strong ? 'highlight-value' : ''}>
        {value}
      </strong>
    </div>
  );
}

export default Money;