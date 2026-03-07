import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatWidget.css';

const QuickQuestions = ({ category, onSelect }) => {
    const [questions, setQuestions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuestions();
    }, [category]);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(
                `/api/quick-questions?category=${category}`
            );
            const data = await response.json();
            setQuestions(data.questions || []);
        } catch (error) {
            // Fallback questions
            setQuestions([
                "Tell me about this product",
                "What's the price?",
                "Is it in stock?",
                "Delivery time?"
            ]);
        }
    };

    return (
        <div className="quick-questions">
            <div className="quick-questions-label">Quick questions:</div>
            <div className="quick-questions-list">
                {questions.map((q, idx) => (
                    <button
                        key={idx}
                        className="quick-question-btn"
                        onClick={() => onSelect(q)}
                    >
                        {q}
                    </button>
                ))}
                {/* Always show a Compare Products action */}
                <button
                    className="quick-question-btn quick-question-btn--compare"
                    onClick={() => navigate('/compare')}
                >
                    ⊕ Compare Products
                </button>
            </div>
        </div>
    );
};

export default QuickQuestions;
