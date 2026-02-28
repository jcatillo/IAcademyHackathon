import { Routes, Route } from "react-router-dom";
import StudentApp from "./pages/StudentApp";
import TeacherDashboard from "./pages/TeacherDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<StudentApp />} />
      <Route path="/teacher" element={<TeacherDashboard />} />
    </Routes>
  );
}

