import { useState, useEffect, useRef } from 'react';
import API from '../services/api'
import { socket } from '../services/socket';
import { useAuth } from '../context/AuthContext';

interface Message {
    id: string;
    content: string;
    timestamp: string;
    senderId: string;
    sender: {
        username: string;
    }
}

interface ChatWindowProps {
    selectedUser: {
        id: string;
        username: string;
    };
}

export default function ChatWindow({ selectedUser }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();

    // Generate a room ID based on user IDs (ensure consistent room ID for both users)
    const generateRoomId = (userId1: string, userId2: string) => {
        return [userId1, userId2].sort().join('-');
    };

    useEffect(() => {
        const fetchChatHistory = async() => {
            setLoading(true);
            setError('');
            try {
                const response = await API.get(`/messages/history/${selectedUser.id}`);
                setMessages(response.data);
            } catch (err: any) {
                setError(err.response?.error || "Failed to load chat history" );
            } finally {
                setLoading(false);
            }
        };

        if (selectedUser.id) {
            fetchChatHistory();
        }
    }, [selectedUser.id]);

    // Socket.IO setup for real-time messaging
    useEffect(() => {
        if (!user || !selectedUser.id) return;

        const roomId = generateRoomId(user, selectedUser.id);
        console.log('Joining room:', roomId, 'for user:', user);
        
        // Join the room
        socket.emit('joinRoom', { roomId, userId: user });

        // Listen for incoming messages
        const handleNewMessage = (messageData: any) => {
            console.log('Received new message:', messageData);
            setMessages(prev => [...prev, messageData]);
        };

        socket.on('newMessage', handleNewMessage);

        // Cleanup on component unmount or user change
        return () => {
            console.log('Cleaning up socket listeners for room:', roomId);
            socket.off('newMessage', handleNewMessage);
        };
    }, [user, selectedUser.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user) return;

        try {
            const response = await API.post('/messages/send', {
                receiverId: selectedUser.id,
                content: newMessage
            });

            // Add message to local state immediately
            setMessages(prev => [...prev, response.data]);

            // Emit message via socket for real-time delivery to other user
            const roomId = generateRoomId(user, selectedUser.id);
            socket.emit('sendMessage', {
                roomId,
                message: response.data,
                userId: user
            });

            setNewMessage('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to send message');
        }
    };

    return (
        <div className='flex flex-col h-[600px]'>
            <div className='p-4 bg-gray-50'>
                <h2 className='font-semibold'>{selectedUser.username}</h2>
            </div>

            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {loading ? (
                    <div className='text-center text-gray-500'>
                        Loading messages...
                    </div>
                ) : error ? (
                    <div className='text-center text-red-500'>{error}</div>
                ) : (
                    messages.map(message => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.senderId === selectedUser.id ? 'justify-start' : 'justify-end'
                            }`}
                        >
                            <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                    message.senderId === selectedUser.id
                                    ? 'bg-gray-100'
                                    : 'bg-blue-500 text-white'
                                }`}
                            >
                                <p>{message.content}</p>
                                <p className='text-xs mt-1 opacity-70'>
                                    {new Date(message.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef}/>
            </div>
            
            <form 
                onSubmit={handleSendMessage}
                className='p-4 border-t'
            >
                <div className='flex gap-2'>
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder='Write a message..'
                        className='flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <button
                        type='submit'
                        className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={!newMessage.trim()}
                        >
                        Send
                    </button>
                </div>
            </form>

        </div>
    )

}