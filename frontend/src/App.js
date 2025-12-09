import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";
import MyFiles from "./components/MyFiles";

// Check if user is authenticated
const isAuthenticated = () => !!localStorage.getItem("token");

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/upload"
          element={isAuthenticated() ? <Upload /> : <Navigate to="/login" />}
        />
        <Route
          path="/my-files"
          element={isAuthenticated() ? <MyFiles /> : <Navigate to="/login" />}
        />

        {/* Redirect unknown routes */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
