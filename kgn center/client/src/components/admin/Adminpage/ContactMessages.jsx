import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Admincss/ContactMessages.css';

const ContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('unread'); // 'read' or 'unread'
    const [error, setError] = useState('');
    const [expandedId, setExpandedId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const res = await axios.get('/api/contact/messages');
            // Add a `read` field to each message (you can adjust if this comes from DB)
            const dataWithRead = res.data.map((msg) => ({ ...msg, read: false }));
            setMessages(dataWithRead);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch messages. Please try again.');
            setLoading(false);
        }
    };

    const toggleReadStatus = (id) => {
        setMessages((prev) =>
            prev.map((msg) =>
                msg._id === id ? { ...msg, read: !msg.read } : msg
            )
        );
    };

    const filteredMessages = messages.filter(
        (msg) =>
            (activeTab === 'read' ? msg.read : !msg.read) &&
            (msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                msg.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDate = (dateStr) => {
        const options = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        };
        return new Date(dateStr).toLocaleString('en-IN', options);
    };

    return (
        <div className="contact-container">
            <h2>📩 Contact Messages</h2>

            <div className="tab-bar">
                <button
                    className={activeTab === 'unread' ? 'active' : ''}
                    onClick={() => setActiveTab('unread')}
                >
                    Unread
                </button>
                <button
                    className={activeTab === 'read' ? 'active' : ''}
                    onClick={() => setActiveTab('read')}
                >
                    Read
                </button>
            </div>

            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />

            {loading ? (
                <div className="spinner"></div>
            ) : error ? (
                <div className="error-msg">{error}</div>
            ) : filteredMessages.length === 0 ? (
                <div className="no-msg">No messages received.</div>
            ) : (
                <div className="messages-grid">
                    {filteredMessages.map((msg) => (
                        <div
                            key={msg._id}
                            className={`message-card ${msg.read ? 'read' : 'unread'}`}
                            onClick={() => {
                                setExpandedId(expandedId === msg._id ? null : msg._id);
                                if (!msg.read) toggleReadStatus(msg._id);
                            }}
                        >
                            <p className="msg-name"><div>{msg.name} </div> <div className='msg-expanded'> {formatDate(msg.createdAt)}</div></p>
                            <p className="msg-email">{msg.email}</p>
                            <p><strong>Message:</strong> {msg.message}</p>
                            {expandedId === msg._id && (
                                <div className="msg-expanded">

                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactMessages;
