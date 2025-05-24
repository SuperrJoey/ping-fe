import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import UserSearch from '../components/UserSearch';
import ChatWindow from '../components/ChatWindow';

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState<{ id: string; username: string } | null>(() => {
        // Try to get selected user from localStorage on initial load
        const saved = localStorage.getItem('selectedUser');
        return saved ? JSON.parse(saved) : null;
    });

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await API.post("/auth/register", { username, password });
            navigate("/login");
        } catch (error : any) {
            setError( error.response?.data?.message ||"Registration Failed")
        }
    };

    // Save selected user to localStorage whenever it changes
    useEffect(() => {
        if (selectedUser) {
            localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
        } else {
            localStorage.removeItem('selectedUser');
        }
    }, [selectedUser]);

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