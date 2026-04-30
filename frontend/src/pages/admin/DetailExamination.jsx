import React, { useEffect, useMemo, useState } from 'react';
import './DetailExamination.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../Layout/AdminLayout';
// import apiService from '../../services/apiService';

const FACULTY_BRANCHES = {
  'คณะครุศาสตร์': ['การศึกษาปฐมวัย', 'คณิตศาสตร์', 'ภาษาไทย'],
  'คณะวิทยาศาสตร์และเทคโนโลยี': [
    'วิทยาการคอมพิวเตอร์',
    'เทคโนโลยีสารสนเทศ',
    'วิทยาศาสตร์ทั่วไป',
  ],
  'คณะมนุษยศาสตร์และสังคมศาสตร์': ['ภาษาอังกฤษ', 'รัฐประศาสนศาสตร์', 'นิติศาสตร์'],
  'คณะวิทยาการจัดการ': ['การจัดการ', 'การบัญชี', 'การตลาด'],
};

const MOCK_EXAM_DETAILS = [
  {
    id: 1,
    examineeName: 'กานต์พิชชา ใจดี',
    courseName: 'หลักสูตรเตรียมสอบครูผู้ช่วย',
    examDate: '2026-05-12T09:00:00',
    status: 'ผ่าน',
    facultyName: 'คณะครุศาสตร์',
    branchName: 'คณิตศาสตร์',
    examRound: 'TCAS',
    examYear: '2569',
  },
  {
    id: 2,
    examineeName: 'ณัฐวุฒิ แสงทอง',
    courseName: 'หลักสูตรวิเคราะห์ข้อสอบภาค ก',
    examDate: '2026-05-12T13:00:00',
    status: 'รอตรวจ',
    facultyName: 'คณะวิทยาศาสตร์และเทคโนโลยี',
    branchName: 'วิทยาการคอมพิวเตอร์',
    examRound: 'Quota',
    examYear: '2569',
  },
  {
    id: 3,
    examineeName: 'พิมพ์ชนก วงศ์สวัสดิ์',
    courseName: 'หลักสูตรภาษาอังกฤษเพื่อการสอบ',
    examDate: '2026-06-03T09:30:00',
    status: 'ไม่ผ่าน',
    facultyName: 'คณะมนุษยศาสตร์และสังคมศาสตร์',
    branchName: 'ภาษาอังกฤษ',
    examRound: 'Admission',
    examYear: '2569',
  },
  {
    id: 4,
    examineeName: 'ชยพล มีสุข',
    courseName: 'หลักสูตรการจัดการเชิงกลยุทธ์',
    examDate: '2025-12-18T10:00:00',
    status: 'ผ่าน',
    facultyName: 'คณะวิทยาการจัดการ',
    branchName: 'การจัดการ',
    examRound: 'Portfolio',
    examYear: '2568',
  },
];

const SelectField = ({
  label,
  value,
  options,
  onChange,
  disabled = false,
  placeholder = 'ทั้งหมด',
}) => (
  <label className="detail-filter-field">
    <span>{label}</span>
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
);

const normalizeExamDetail = (item, index) => ({
  id: item.id || item._id || index + 1,
  examineeName: item.examineeName || item.studentName || item.name || '-',
  courseName: item.courseName || item.course || '-',
  examDate: item.examDate || item.date || item.createdAt || '',
  status: item.status || 'รอตรวจ',
  facultyName: item.facultyName || item.faculty || '',
  branchName: item.branchName || item.branch || item.majorName || '',
  examRound: item.examRound || item.round || '',
  examYear: item.examYear || item.year || '',
});

export default function DetailExamination() {
  const navigate = useNavigate();
  const location = useLocation();
  const { examinationId } = useParams();
  const selectedExamination = location.state?.examination;

  const [examDetails, setExamDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [filters, setFilters] = useState({
    facultyName: '',
    branchName: '',
    examRound: '',
    examYear: '',
  });

  const fetchExamDetails = async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      /*
        สำหรับเชื่อมฐานข้อมูลในอนาคต:
        const data = await apiService.getExaminationDetails(examinationId, {
          facultyName: filters.facultyName,
          branchName: filters.branchName,
          examRound: filters.examRound,
          examYear: filters.examYear,
        });

        const list = Array.isArray(data)
          ? data
          : data.data || data.examinationDetails || data.items || [];

        setExamDetails(list.map(normalizeExamDetail));
      */

      setExamDetails(MOCK_EXAM_DETAILS.map(normalizeExamDetail));
    } catch (error) {
      console.error(error);
      setErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูลรายละเอียดการสอบ');
      setExamDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamDetails();
  }, []);

  const facultyOptions = useMemo(() => Object.keys(FACULTY_BRANCHES), []);

  const branchOptions = useMemo(() => {
    if (!filters.facultyName) return [];
    return FACULTY_BRANCHES[filters.facultyName] || [];
  }, [filters.facultyName]);

  const roundOptions = useMemo(() => {
    const rounds = examDetails.map((item) => item.examRound).filter(Boolean);
    return [...new Set(rounds)];
  }, [examDetails]);

  const yearOptions = useMemo(() => {
    const years = examDetails.map((item) => item.examYear).filter(Boolean);
    return [...new Set(years)].sort((a, b) => Number(b) - Number(a));
  }, [examDetails]);

  const filteredExamDetails = useMemo(() => {
    return examDetails.filter((item) => {
      const matchesFaculty =
        !filters.facultyName || item.facultyName === filters.facultyName;

      const matchesBranch =
        !filters.branchName || item.branchName === filters.branchName;

      const matchesRound =
        !filters.examRound || item.examRound === filters.examRound;

      const matchesYear =
        !filters.examYear || item.examYear === filters.examYear;

      return matchesFaculty && matchesBranch && matchesRound && matchesYear;
    });
  }, [examDetails, filters]);

  const updateFilter = (key, value) => {
    setFilters((current) => {
      if (key === 'facultyName') {
        return {
          ...current,
          facultyName: value,
          branchName: '',
        };
      }

      return {
        ...current,
        [key]: value,
      };
    });
  };

  const resetFilters = () => {
    setFilters({
      facultyName: '',
      branchName: '',
      examRound: '',
      examYear: '',
    });
  };

  return (
    <AdminLayout>
      <section className="detail-exam-page">
        <div className="detail-top-actions">
          <button
            type="button"
            className="detail-back-button"
            onClick={() => navigate(-1)}
          >
            ← ย้อนกลับ
          </button>
        </div>

        <div className="detail-page-heading">
          <div>
            <p className="eyebrow-text">รายละเอียดผู้สอบ</p>
            <h1>ข้อมูลผู้สอบจากปุ่มดูรายละเอียด</h1>
            <p>
              {selectedExamination?.name
                ? `สถาบัน: ${selectedExamination.name}`
                : 'กรองข้อมูลตามคณะ สาขา รอบสอบ และปีที่สอบ'}
            </p>

            {examinationId && (
              <p className="detail-reference-text">รหัสอ้างอิง: {examinationId}</p>
            )}
          </div>

          <div className="detail-summary-card">
            <span>รายการที่แสดงผล</span>
            <strong>{filteredExamDetails.length.toLocaleString('th-TH')}</strong>
            <small>
              จากทั้งหมด {examDetails.length.toLocaleString('th-TH')} รายการ
            </small>
          </div>
        </div>

        <section className="detail-filter-panel" aria-label="ตัวกรองรายละเอียดการสอบ">
          <div className="detail-filter-grid">
            <SelectField
              label="ชื่อคณะ"
              value={filters.facultyName}
              options={facultyOptions}
              onChange={(value) => updateFilter('facultyName', value)}
            />

            <SelectField
              label="ชื่อสาขา"
              value={filters.branchName}
              options={branchOptions}
              onChange={(value) => updateFilter('branchName', value)}
              disabled={!filters.facultyName}
              placeholder={filters.facultyName ? 'ทั้งหมด' : 'เลือกคณะก่อน'}
            />

            <SelectField
              label="รอบที่สอบ"
              value={filters.examRound}
              options={roundOptions}
              onChange={(value) => updateFilter('examRound', value)}
            />

            <SelectField
              label="ปีที่สอบ"
              value={filters.examYear}
              options={yearOptions}
              onChange={(value) => updateFilter('examYear', value)}
            />
          </div>

          <div className="detail-filter-actions">
            <button type="button" className="primary-button" onClick={fetchExamDetails}>
              โหลดข้อมูลใหม่
            </button>
            <button type="button" className="secondary-button" onClick={resetFilters}>
              รีเซ็ตตัวกรอง
            </button>
          </div>
        </section>

        <section className="detail-table-card">
          <div className="detail-table-header">
            <div>
              <h2>ตารางรายชื่อผู้สอบ</h2>
              <p>แสดงข้อมูลผู้สอบตามเงื่อนไขที่เลือก</p>
            </div>

            <div className="detail-total-examinees">
              <span>ผู้เข้าสอบทั้งหมด</span>
              <strong>{examDetails.length.toLocaleString('th-TH')}</strong>
              <small>คน</small>
            </div>
          </div>

          {loading ? (
            <div className="detail-empty-state">กำลังโหลดข้อมูล...</div>
          ) : errorMessage ? (
            <div className="detail-empty-state danger-text">{errorMessage}</div>
          ) : (
            <>
              <div className="detail-table-scroll">
                <table className="detail-table">
                  <thead>
                    <tr>
                      <th>ลำดับ</th>
                      <th>ชื่อผู้เข้าสอบ</th>
                      <th>คอร์สที่เรียน</th>
                      <th>รอบที่เข้าสอบ</th>
                      <th>คณะ</th>
                      <th>สาขา</th>
                      <th>ปีที่สอบ</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredExamDetails.length > 0 ? (
                      filteredExamDetails.map((item, index) => (
                        <tr key={item.id}>
                          <td className="mono">{index + 1}</td>
                          <td className="name-cell">{item.examineeName}</td>
                          <td>{item.courseName || '-'}</td>
                          <td>{item.examRound || '-'}</td>
                          <td>{item.facultyName || '-'}</td>
                          <td>{item.branchName || '-'}</td>
                          <td>{item.examYear || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7">
                          <div className="detail-empty-state">
                            ไม่พบข้อมูลผู้สอบตามเงื่อนไขที่เลือก
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="detail-table-footer">
                <span>
                  แสดง {filteredExamDetails.length ? 1 : 0} ถึง{' '}
                  {filteredExamDetails.length} จาก {examDetails.length} รายการ
                </span>
              </div>
            </>
          )}
        </section>
      </section>
    </AdminLayout>
  );
}