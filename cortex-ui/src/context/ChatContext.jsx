import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [initialMessage, setInitialMessage] = useState('');
    const [productContext, setProductContext] = useState(null);

    const openChat = (message = '', context = null) => {
        if (message) setInitialMessage(message);
        if (context) setProductContext(context);
        setIsOpen(true);
    };

    const closeChat = () => {
        setIsOpen(false);
        setInitialMessage('');
        setProductContext(null);
    };

    const toggleChat = () => setIsOpen(prev => !prev);

    return (
        <ChatContext.Provider value={{ isOpen, initialMessage, productContext, setProductContext, openChat, closeChat, toggleChat }}>
            {children}
        </ChatContext.Provider>
    );
};
