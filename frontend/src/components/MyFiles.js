import { useEffect, useState } from "react";

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
      console.log("Fetched files:", data);
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
      else alert(data.error);
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
        return alert(err.error);
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

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div style={{ padding: "30px" }}>
      <h1>My Files</h1>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Privacy</th>
            <th>Download</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => (
            <tr key={file._id}>
              <td>{file.filename}</td>
              <td>{file.privacy}</td>
              <td>
                <button onClick={() => downloadFile(file._id, file.filename)}>Download</button>
              </td>
              <td>
                <button style={{ color: "red" }} onClick={() => deleteFile(file._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyFiles;
