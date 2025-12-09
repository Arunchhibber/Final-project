import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch user's files
  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/files/my-files", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch files");

      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch files");
    }
  };

  // Delete file
  const deleteFile = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/api/files/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setFiles(files.filter((file) => file._id !== id));
        alert("File deleted");
      } else {
        alert(data.error || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Download file
  const downloadFile = async (id, filename) => {
    try {
      const res = await fetch(`http://localhost:8000/api/files/download/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.error || "Download failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  // Upload file
  const uploadFile = async () => {
    if (!selectedFile) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("privacy", "public");

    try {
      const res = await fetch("http://localhost:8000/api/files/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        alert("File uploaded");
        setSelectedFile(null);
        fetchFiles();
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="dashboard-container">
      
      {/* Upload Section */}
      <div className="section-box">
        <h2>Upload File</h2>
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button onClick={uploadFile}>Upload</button>
      </div>

      {/* Files Table */}
      <div className="section-box">
        <h2>My Files</h2>

        {files.length === 0 ? (
          <p>No files uploaded yet</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Filename</th>
                <th>Privacy</th>
                <th>Download</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  <td>{file.filename}</td>
                  <td>{file.privacy}</td>

                  <td>
                    <button onClick={() => downloadFile(file._id, file.filename)}>
                      Download
                    </button>
                  </td>

                  <td>
                    <button className="delete-btn" onClick={() => deleteFile(file._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
