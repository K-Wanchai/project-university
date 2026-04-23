import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Standard from "./pages/admin/Standard.jsx"; 
import User from "./pages/admin/User.jsx";
import Newuser from "./pages/admin/Newuser.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Standard />} />
        <Route path="/user" element={<User />} /> 
        <Route path="/newuser" element={<Newuser />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;