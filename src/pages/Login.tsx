import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await API.post("/auth/login", { username, password});
            login(res.data.username, res.data.token);
            navigate("/chat");
        } catch (error: any) {
            setError(error.response?.data?.message || "Login Failed");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
          <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
            <h2 className="text-xl font-bold text-center">Login</h2>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
              Login
            </button>
          </form>
        </div>
      );

}