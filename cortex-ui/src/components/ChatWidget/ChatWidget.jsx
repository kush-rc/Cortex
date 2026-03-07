import React, { useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import ChatPanel from './ChatPanel';
import './ChatWidget.css';

/**
 * GIZMO Chat Widget
 * Controlled via ChatContext (Navbar icon or "Ask GIZMO" buttons)
 * Also listens for 'open-gizmo' custom event from the Support page
 */
const ChatWidget = () => {
    const { isOpen, openChat, closeChat, initialMessage, productContext } = useChat();

    // Listen for custom 'open-gizmo' event (dispatched from Support page)
    useEffect(() => {
        const handler = () => openChat();
        window.addEventListener('open-gizmo', handler);
        return () => window.removeEventListener('open-gizmo', handler);
    }, [openChat]);

    return (
        <ChatPanel
            isOpen={isOpen}
            onClose={closeChat}
            initialMessage={initialMessage}
            productContext={productContext}
        />
    );
};

export default ChatWidget;

