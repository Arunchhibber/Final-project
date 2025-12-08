import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Register from "./components/Register";
import Login from "./components/Login";
import Upload from "./components/Upload";
import MyFiles from "./components/MyFiles";
import Downloads from "./components/Downloads";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/my-files" element={<MyFiles />} />
        <Route path="/downloads" element={<Downloads />} />
      </Routes>
    </Router>
  );
}

export default App;
