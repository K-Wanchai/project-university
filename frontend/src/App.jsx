import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/user/pages/Login.jsx';
import Register from './pages/user/pages/Register.jsx';
import ParentLogin from './pages/user/pages/ParentLogin.jsx';

import Homepage from './pages/user/pages/Homepage.jsx';

import Standard from './pages/admin/Standard.jsx';
import User from './pages/admin/User.jsx';
import Newuser from './pages/admin/Newuser.jsx';
import Course from './pages/admin/Course.jsx';
import Editcourse from './pages/admin/Editcourse.jsx';
import Addcourse from './pages/admin/Addcourse.jsx';
import SchoolInfo from './pages/admin/SchoolInfo.jsx';
import EditSchoolInfo from './pages/admin/EditSchoolInfo.jsx';
import Examination from './pages/admin/Examination.jsx';
import EditExamination from './pages/admin/EditExamination.jsx';
import Money from './pages/admin/Money.jsx';
import AddExamination from './pages/admin/AddExamination.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* เปิดหน้าแรกให้ไปหน้า Login */}
        <Route path="/" element={<Navigate to="/Standard" replace />} />

        {/* User */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/parentlogin" element={<ParentLogin />} />
        <Route path="/homepage" element={<Homepage />} />


        {/* Admin */}
        <Route path="/standard" element={<Standard />} />
        <Route path="/user" element={<User />} />
        <Route path="/newuser" element={<Newuser />} />
        <Route path="/course" element={<Course />} />
        <Route path="/edit-course/:id" element={<Editcourse />} />
        <Route path="/add-course" element={<Addcourse />} />
        <Route path="/school-info" element={<SchoolInfo />} />
        <Route path="/edit-school-info" element={<EditSchoolInfo />} />
        <Route path="/examination" element={<Examination />} />
        <Route path="/edit-examination/:id" element={<EditExamination />} />
        <Route path="/money" element={<Money />} />
        <Route path="/add-examination" element={<AddExamination />} />

        {/* ถ้า path ไม่ตรง ให้กลับไปหน้า Login */}
        <Route path="*" element={<Navigate to="/Login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;