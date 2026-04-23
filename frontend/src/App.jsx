import React from 'react';
// ลบบรรทัดที่ import ซ้ำออก ให้เหลือแค่บรรทัดนี้บรรทัดเดียว
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

import Standard from "./pages/admin/Standard.jsx";
import Newuser from "./pages/admin/Newuser.jsx";
import Course from "./pages/admin/Course.jsx";
import Editcourse from "./pages/admin/Editcourse.jsx"; 
import Addcourse from "./pages/admin/Addcourse.jsx"; 
import SchoolInfo from "./pages/admin/SchoolInfo.jsx";
import EditSchoolInfo from "./pages/admin/EditSchoolInfo.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* เพิ่มบรรทัดนี้เพื่อให้เวลาเข้าหน้าแรกสุดแล้วไม่เจอหน้าขาว (No routes matched) */}
        <Route path="/" element={<Navigate to="/standard" />} />
        
        <Route path="/standard" element={<Standard />} />
        <Route path="/newuser" element={<Newuser />} />
        <Route path="/course" element={<Course />} />
        <Route path="/edit-course/:id" element={<Editcourse />} />
        <Route path="/add-course" element={<Addcourse />} />
        <Route path="/school-info" element={<SchoolInfo />} />
        <Route path="/edit-school-info" element={<EditSchoolInfo />} />
      </Routes>
    </Router>
  );
}

export default App;