import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Upload.css"; // Make sure this file exists

function Upload() {
  const [file, setFile] = useState(null);
  const [privacy, setPrivacy] = useState("private");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a file");

    // FRONTEND VALIDATION
    const allowedTypes = ["application/pdf", "video/mp4"];
    if (!allowedTypes.includes(file.type)) {
      return alert("Unsupported file type. Only PDF and MP4 are allowed.");
    }

    const maxSize = 20 * 1024 * 1024; // 20 MB
    if (file.size > maxSize) {
      return alert("File too large. Maximum size is 20 MB.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("privacy", privacy);

    try {
      await axios.post("http://localhost:8000/api/files/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("File uploaded successfully");
      navigate("/my-files");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Error uploading file");
    }
  };

  return (
    <div className="upload-container">
      <div className="upload-box">
        <h2>Upload File</h2>
        <form onSubmit={handleUpload}>
          <div className="form-group">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group privacy-group">
            <label>
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={privacy === "private"}
                onChange={(e) => setPrivacy(e.target.value)}
              />
              Private
            </label>
            <label>
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={privacy === "public"}
                onChange={(e) => setPrivacy(e.target.value)}
              />
              Public
            </label>
          </div>
          <button type="submit" className="upload-btn">Upload</button>
        </form>
      </div>
    </div>
  );
}

export default Upload;
