import { useState } from "react";
import API from "../services/api";

interface User {
    id: string;
    username: string;
}

interface UserSearchProps {
    onUserSelect: (user: User) => void;
}

export default function UserSearch({ onUserSelect}: UserSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
    
        setLoading(true);
        setError('');
        try {
            const response = await API.get(`/messages/search?query=${searchQuery}`);
            setUsers(response.data);
        } catch (err: any)  {
            setError(err.response?.data?.error || "Failed to search users");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="w-full max-w-md mx-auto p-4">
            <form onSubmit={handleSearch} className="mb-4">
                <div className="flex gap-2">
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users..."
                        className="flex-1 p-2 border rounded"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Search'}
                        </button>
                </div>
            </form>

            {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <div>
                {users.map(user => (
                    <div
                        key={user.id}
                        onClick={() => onUserSelect(user)}
                        className="p-3 border rounded cursor-pointer hover:bg-gray-50"
                        >
                        <p className="font-medium">{user.username}</p>
                    </div>
                ))}
                {users.length === 0 && searchQuery && !loading && (
                    <p className="text-gray-500 text-center">No users found</p>
                )}
            </div>
        </div>
    )
}