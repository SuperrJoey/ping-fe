import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post("/register", { username, password });
            navigate("/login");
        } catch (error : any) {
            setError( error.response?.data?.message ||"Registration Failed")
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80 space-y-4">
                <h2 className="text-xl font-bold text-center">Register</h2>
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
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                    Sign Up
                </button>
            </form>
        </div>
    )


}