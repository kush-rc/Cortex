import React, { useState, useRef, useEffect, useCallback } from 'react';
import './ChatWidget.css';
import QuickQuestions from './QuickQuestions';
import Logo from '../Logo';
import { useAuth } from '../../context/AuthContext';
import { useCompare } from '../../context/CompareContext';
import { Link, useNavigate } from 'react-router-dom';
import gizmoAvatar from './gizmo-avatar.png';

const ChatPanel = ({ isOpen, onClose, initialMessage, productContext }) => {
    const { user } = useAuth();
    const { clearCompare, addToCompare } = useCompare();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    // Lock body scroll when chat is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // Load persisted chat history when panel opens (logged-in users only)
    useEffect(() => {
        if (isOpen && user && !historyLoaded) {
            const token = localStorage.getItem('token');
            if (token) {
                fetch('/api/chat/history', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                    .then(res => res.ok ? res.json() : null)
                    .then(data => {
                        if (data?.history?.length > 0) {
                            setMessages(data.history);
                        }
                        setHistoryLoaded(true);
                    })
                    .catch(() => setHistoryLoaded(true));
            }
        }
    }, [isOpen, user, historyLoaded]);

    // Reset history loaded flag when user changes (login/logout)
    useEffect(() => {
        setHistoryLoaded(false);
        setMessages([]);
    }, [user?.email]);

    // Set initial message when chat opens from a quick question
    useEffect(() => {
        if (isOpen && initialMessage) {
            setInput(initialMessage);
            setTimeout(() => textareaRef.current?.focus(), 100);
        }
    }, [isOpen, initialMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Clear chat history (UI + database)
    const handleClearChat = useCallback(async () => {
        setMessages([]);
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await fetch('/api/chat/history', {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) {
                console.error('Failed to clear chat history:', e);
            }
        }
    }, []);

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // Order query guard for unauthenticated users
        if (text.toLowerCase().includes('order') && !user) {
            setMessages(prev => [
                ...prev,
                { role: 'user', content: text },
                {
                    role: 'assistant',
                    content: (
                        <span>
                            To check your order status, please <Link to="/login" onClick={onClose} style={{ color: '#0071e3', textDecoration: 'underline' }}>sign in</Link> first.
                        </span>
                    )
                }
            ]);
            setInput('');
            return;
        }

        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        setIsLoading(true);

        try {
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('token');
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    message: text,
                    product_context: productContext || {},
                    history: messages // Pass existing history to backend
                })
            });

            const data = await response.json();

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.success
                    ? data.response
                    : "Sorry, I couldn't process that. Please try again."
            }]);
        } catch {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Connection error. Please check if the server is running."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!isLoading && input.trim()) sendMessage(input);
        }
    };

    const handleTextareaChange = (e) => {
        setInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    const showIntro = messages.length === 0;

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div className="chat-backdrop" onClick={onClose} />
            )}

            {/* Side Panel */}
            <div className={`chat-sidepanel ${isOpen ? 'chat-sidepanel--open' : ''}`}>
                {/* Header */}
                <div className="chat-sidepanel__header">
                    <div className="chat-sidepanel__brand">
                        <div className="chat-sidepanel__logo">
                            <Logo />
                        </div>
                        <div>
                            <div className="chat-sidepanel__name">GIZMO <span className="chat-sidepanel__badge">ai</span></div>
                            <div className="chat-sidepanel__tagline">beta</div>
                        </div>
                    </div>
                    <div className="chat-sidepanel__actions">
                        {/* Clear Chat Button */}
                        {messages.length > 0 && (
                            <button className="chat-sidepanel__clear" onClick={handleClearChat} aria-label="Clear chat" title="Clear chat history">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                            </button>
                        )}
                        {/* Close Button */}
                        <button className="chat-sidepanel__close" onClick={onClose} aria-label="Close">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Scrollable Messages Area */}
                <div className="chat-sidepanel__body">
                    {showIntro && (
                        <div className="gizmo-intro fade-in">
                            <h2 className="gizmo-intro__title">
                                Hi, I'm GIZMO!
                            </h2>
                            <p className="gizmo-intro__sub">
                                {productContext?.name
                                    ? <>Ask me anything about <strong>{productContext.name}</strong>.</>
                                    : "Ask me all your product questions. My answers are powered by AI."}
                            </p>
                        </div>
                    )}

                    {showIntro && (
                        <div className="gizmo-suggestions">
                            <p className="gizmo-suggestions__label">How can I help?</p>
                            <div className="gizmo-suggestions__list">
                                {/* Product-specific quick questions */}
                                <QuickQuestions
                                    category={productContext?.category || 'general'}
                                    onSelect={(q) => sendMessage(q)}
                                    variant="large"
                                />
                                {/* Order quick questions for logged-in users */}
                                {user && (
                                    <>
                                        <button className="gizmo-suggestion-btn" onClick={() => sendMessage("Where is my order?")}>
                                            Where is my order?
                                        </button>
                                        <button className="gizmo-suggestion-btn" onClick={() => sendMessage("Tell me about my past orders")}>
                                            Share past order history
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Message Thread */}
                    <div className="gizmo-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`gizmo-msg gizmo-msg--${msg.role}`}>
                                <div className={`gizmo-msg__bubble gizmo-msg__bubble--${msg.role}`}>
                                    {msg.content.split('\n').map((line, i, arr) => {
                                        // Auto-Compare Markdown Interceptor: [Text](compare:id1,id2)
                                        const compareMatch = line.match(/\[(.*?)\]\(compare:(.*?)\)/);
                                        if (compareMatch) {
                                            const [fullMatch, text, idsStr] = compareMatch;
                                            const before = line.substring(0, compareMatch.index);
                                            const after = line.substring(compareMatch.index + fullMatch.length);
                                            const ids = idsStr.split(',').map(id => id.trim());

                                            // Trigger compare flow
                                            const handleAutoCompare = async () => {
                                                clearCompare();
                                                try {
                                                    const res = await fetch(`/api/products/compare?ids=${ids.join(',')}`);
                                                    const data = await res.json();
                                                    if (data.success && data.products) {
                                                        data.products.forEach(p => addToCompare(p));
                                                    } else {
                                                        ids.forEach(id => addToCompare({ id }));
                                                    }
                                                } catch (err) {
                                                    ids.forEach(id => addToCompare({ id }));
                                                }
                                                onClose(); // Close chat
                                                navigate('/compare'); // Go to compare page
                                            };

                                            return (
                                                <span key={i} style={{ display: 'block', lineHeight: '1.5', marginTop: '8px' }}>
                                                    {before}
                                                    <button
                                                        onClick={handleAutoCompare}
                                                        style={{
                                                            background: '#0071e3', color: '#fff', border: 'none',
                                                            padding: '8px 16px', borderRadius: '980px', fontSize: '13px',
                                                            cursor: 'pointer', margin: '4px 0', display: 'inline-flex', alignItems: 'center', gap: '4px'
                                                        }}
                                                    >
                                                        ⊕ {text}
                                                    </button>
                                                    {after}
                                                </span>
                                            );
                                        }

                                        // Learn More Link Interceptor: [Text](learn:ProductName)
                                        const learnMatch = line.match(/\[(.*?)\]\(learn:(.*?)\)/);
                                        if (learnMatch) {
                                            const [fullMatch, text, productName] = learnMatch;
                                            const before = line.substring(0, learnMatch.index);
                                            const after = line.substring(learnMatch.index + fullMatch.length);

                                            const handleLearnMore = async () => {
                                                try {
                                                    const res = await fetch(`/api/products/compare?ids=${encodeURIComponent(productName.trim())}`);
                                                    const data = await res.json();
                                                    if (data.success && data.products?.length > 0) {
                                                        const p = data.products[0];
                                                        onClose();
                                                        navigate(`/product/${p.id || p._id}`);
                                                    }
                                                } catch (err) {
                                                    console.error('Learn more navigation failed:', err);
                                                }
                                            };

                                            return (
                                                <span key={i} style={{ display: 'block', lineHeight: '1.5', marginTop: '8px' }}>
                                                    {before}
                                                    <button
                                                        onClick={handleLearnMore}
                                                        style={{
                                                            background: 'transparent', color: '#0071e3', border: '1px solid #0071e3',
                                                            padding: '8px 16px', borderRadius: '980px', fontSize: '13px',
                                                            cursor: 'pointer', margin: '4px 0', display: 'inline-flex', alignItems: 'center', gap: '4px'
                                                        }}
                                                    >
                                                        → {text}
                                                    </button>
                                                    {after}
                                                </span>
                                            );
                                        }

                                        // Render --- as a visual divider
                                        if (line.trim() === '---') {
                                            return <hr key={i} style={{ border: 'none', borderTop: '1px solid rgba(0,0,0,0.1)', margin: '6px 0' }} />;
                                        }
                                        // Render "Label: Value" patterns with bold labels
                                        const labelMatch = line.match(/^(Order|Product|Placed|Status|Expected by|Delivered on|Delivered|Expected):\s*(.+)$/);
                                        if (labelMatch) {
                                            return (
                                                <span key={i} style={{ display: 'block', lineHeight: '1.5' }}>
                                                    <strong style={{ color: '#333' }}>{labelMatch[1]}:</strong> {labelMatch[2]}
                                                </span>
                                            );
                                        }
                                        // Render numbered items (order titles) with slightly larger font
                                        const numMatch = line.match(/^(\d+)\.\s+(.+)$/);
                                        if (numMatch) {
                                            return (
                                                <span key={i} style={{ display: 'block', fontWeight: '600', marginTop: '2px', lineHeight: '1.5' }}>
                                                    {numMatch[1]}. {numMatch[2]}
                                                </span>
                                            );
                                        }

                                        // Render markdown bold **text** as <strong>
                                        if (line.includes('**')) {
                                            const parts = line.split(/\*\*(.*?)\*\*/g);
                                            return (
                                                <span key={i} style={{ display: 'block', lineHeight: '1.5' }}>
                                                    {parts.map((part, j) =>
                                                        j % 2 === 1
                                                            ? <strong key={j} style={{ color: '#333' }}>{part}</strong>
                                                            : <span key={j}>{part}</span>
                                                    )}
                                                    {i < arr.length - 1 && <br />}
                                                </span>
                                            );
                                        }

                                        return (
                                            <span key={i}>
                                                {line}
                                                {i < arr.length - 1 && <br />}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="gizmo-msg gizmo-msg--assistant">
                                <div className="gizmo-typing">
                                    <span /><span /><span />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Bar */}
                <div className="chat-sidepanel__footer">
                    <form className="gizmo-input-form" onSubmit={handleSubmit}>
                        <textarea
                            ref={textareaRef}
                            className="gizmo-input"
                            value={input}
                            onChange={handleTextareaChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask GIZMO a question..."
                            disabled={isLoading}
                            rows={1}
                        />
                        <button
                            type="submit"
                            className="gizmo-send-btn"
                            disabled={isLoading || !input.trim()}
                            aria-label="Send"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13" />
                                <polygon points="22 2 15 22 11 13 2 9 22 2" />
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ChatPanel;
