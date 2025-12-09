import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/auth/login", // Backend port
        { email, password }
      );

      console.log("Login response:", res);

      // Store token and username
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);

      alert(`Welcome ${res.data.user.username}!`);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err.response?.data?.msg ||
        err.response?.data?.error ||
        "Login failed. Is the backend running?";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: "10px" }}>
          <input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{ width: "100%", padding: "10px", cursor: "pointer" }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "blue", textDecoration: "underline" }}>
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
