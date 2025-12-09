import { useEffect, useState } from "react";
import "./MyFiles.css";

function MyFiles() {
  const [files, setFiles] = useState([]);
  const token = localStorage.getItem("token");

  // Fetch user files
  const fetchFiles = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/files/my-files", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      if (res.ok) setFiles(files.filter(f => f._id !== id));
      else alert(data.error || "Delete failed");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // Download file
  const downloadFile = async (file) => {
    try {
      // Include shareId if private
      let url = `http://localhost:8000/api/files/download/${file._id}`;
      if (file.privacy === "private") url += `/${file.shareId}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const err = await res.json();
        return alert(err.error || "Download failed");
      }

      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = file.filename;
      a.click();
      window.URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error(err);
      alert("Download failed");
    }
  };

  // Copy share link
  const copyShareLink = (file) => {
    let link = `${window.location.origin}/file/${file._id}`;
    if (file.privacy === "private") link += `/${file.shareId}`;

    navigator.clipboard.writeText(link);
    alert("Share link copied to clipboard!");
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className="myfiles-container">
      <div className="myfiles-box">
        <h1>My Files</h1>
        <table className="files-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Privacy</th>
              <th>Size</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map(file => (
              <tr key={file._id}>
                <td>{file.filename}</td>
                <td>{file.privacy}</td>
                <td>{(file.size / (1024 * 1024)).toFixed(2)} MB</td>
                <td className="actions-cell">
                  <button className="download-btn" onClick={() => downloadFile(file)}>
                    Download
                  </button>
                  <button className="delete-btn" onClick={() => deleteFile(file._id)}>
                    Delete
                  </button>
                  <button className="share-btn" onClick={() => copyShareLink(file)}>
                    Share
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MyFiles;
