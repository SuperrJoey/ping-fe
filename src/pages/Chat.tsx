import { useState, useEffect } from "react";
import UserSearch from "../components/UserSearch";
import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
    const { logout, user } = useAuth();
    const [selectedUser, setSelectedUser] = useState<{ id: string, username: string } | null>(() => {
        // Load selected user from sessionStorage on component mount
        const saved = sessionStorage.getItem('selectedUser');
        return saved ? JSON.parse(saved) : null;
    });

    // Save selected user to sessionStorage whenever it changes
    useEffect(() => {
        if (selectedUser) {
            sessionStorage.setItem('selectedUser', JSON.stringify(selectedUser));
        } else {
            sessionStorage.removeItem('selectedUser');
        }
    }, [selectedUser]);

    const handleLogout = () => {
        logout();
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                    Chat
                </h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </div>
            {!selectedUser ? (
                <UserSearch onUserSelect={setSelectedUser} />
            ): (
                <div className="space-y-4">
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="text-blue-500 hover:text-blue-700"
                        >
                        Back to search
                    </button>
                    <ChatWindow selectedUser={selectedUser} />
                </div>
            )}
        </div>
    )
}