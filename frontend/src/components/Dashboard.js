import { useEffect, useState } from "react";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("upload"); // default section
  const [files, setFiles] = useState([]);
  const [publicFiles, setPublicFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const token = localStorage.getItem("token");

  // --------------------------
  // FETCH MY FILES
  // --------------------------
  const fetchMyFiles = async () => {
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

  // --------------------------
  // FETCH PUBLIC FILES
  // --------------------------
  const fetchPublicFiles = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/files/public-files");
      if (!res.ok) throw new Error("Failed to fetch public files");
      const data = await res.json();
      setPublicFiles(data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch public files");
    }
  };

  useEffect(() => {
    fetchMyFiles();
    fetchPublicFiles();
  }, []);

  // --------------------------
  // DELETE FILE
  // --------------------------
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

  // --------------------------
  // DOWNLOAD FILE
  // --------------------------
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

  // --------------------------
  // UPLOAD FILE
  // --------------------------
  const uploadFile = async () => {
    if (!selectedFile) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("privacy", "public"); // or "private"

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
        fetchMyFiles();
        fetchPublicFiles();
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  // --------------------------
  // GET SHARE LINK
  // --------------------------
  const generateLink = async (id) => {
    alert(`Private file download URL: http://localhost:8000/api/files/share/${id}`);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h1>Welcome, {localStorage.getItem("username")}!</h1>

      {/* ---------- Navigation Bar ---------- */}
      <div style={{ margin: "20px 0" }}>
        <button
          onClick={() => setActiveSection("upload")}
          style={{ fontWeight: activeSection === "upload" ? "bold" : "normal", marginRight: "10px" }}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveSection("myfiles")}
          style={{ fontWeight: activeSection === "myfiles" ? "bold" : "normal", marginRight: "10px" }}
        >
          My Files
        </button>
        <button
          onClick={() => setActiveSection("downloads")}
          style={{ fontWeight: activeSection === "downloads" ? "bold" : "normal" }}
        >
          Downloads
        </button>
      </div>

      {/* ---------- Upload Section ---------- */}
      {activeSection === "upload" && (
        <div>
          <h2>Upload File</h2>
          <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
          <button onClick={uploadFile}>Upload</button>
        </div>
      )}

      {/* ---------- My Files Section ---------- */}
      {activeSection === "myfiles" && (
        <div>
          <h2>My Files</h2>
          <table border="1" cellPadding="10">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Size (KB)</th>
                <th>Privacy</th>
                <th>Download</th>
                <th>Share</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file._id}>
                  <td>{file.filename}</td>
                  <td>{(file.size / 1024).toFixed(2)}</td>
                  <td>{file.privacy}</td>
                  <td>
                    <button onClick={() => downloadFile(file._id, file.filename)}>Download</button>
                  </td>
                  <td>
                    {file.privacy === "private" ? (
                      <button onClick={() => generateLink(file._id)}>Get Link</button>
                    ) : (
                      "Public"
                    )}
                  </td>
                  <td>
                    <button style={{ color: "red" }} onClick={() => deleteFile(file._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ---------- Downloads Section ---------- */}
      {activeSection === "downloads" && (
        <div>
          <h2>Public Downloads</h2>
          {publicFiles.length === 0 ? (
            <p>No public files available</p>
          ) : (
            publicFiles.map((file) => (
              <div key={file._id} style={{ marginBottom: "10px" }}>
                {file.filename}{" "}
                <button onClick={() => downloadFile(file._id, file.filename)}>Download</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
