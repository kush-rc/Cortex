import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Support.css';

const SUPPORT_EMAIL = 'support@cortex.com';
const SUPPORT_PHONE = '1800-123-4567';
const SUPPORT_HOURS = 'Mon - Sat, 9:00 AM - 9:00 PM IST';

const faqs = [
    {
        q: 'How do I track my order?',
        a: 'Go to your Profile page and scroll down to the Order History section. Click on any order to see its current status, tracking details, and estimated delivery date.'
    },
    {
        q: 'What is the return policy?',
        a: 'You can return most products within 14 days of delivery. Go to your Profile page, open the delivered order, and click the "Return Item" button. Items must be in original condition with all accessories.'
    },
    {
        q: 'How do I exchange a product?',
        a: 'Navigate to your Profile page, find the delivered order, and click the "Exchange" button. You can exchange for a different color, storage size, or variant of the same product.'
    },
    {
        q: 'How do I raise a support ticket?',
        a: 'Open GIZMO (the chat assistant) and type "raise a ticket for <your issue>". GIZMO will guide you through the process and create a ticket that you can track in your Profile under Support Tickets.'
    },
    {
        q: 'Can I cancel my order?',
        a: 'Orders in "Processing" status can be cancelled. Go to your Profile page, find the order, and contact support via chat or call with the order ID. Once an order has shipped, cancellation is no longer possible.'
    },
    {
        q: 'What payment methods do you accept?',
        a: 'We accept Credit/Debit Cards (Visa, Mastercard, RuPay) and UPI payments. You can save your preferred payment method in your Profile settings for faster checkout.'
    },
    {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 5-7 business days. Metro cities may receive orders in 3-5 business days. You will receive an estimated delivery date at checkout and can track your order in real-time.'
    },
    {
        q: 'Is my personal data secure?',
        a: 'Yes. We use industry-standard encryption for all personal and payment information. Our AI assistant GIZMO is designed to never reveal, store, or share sensitive data like passwords, card numbers, or addresses.'
    }
];

const Support = () => {
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (idx) => {
        setOpenFaq(openFaq === idx ? null : idx);
    };

    return (
        <div className="support-page">
            <div className="support-container">

                {/* Hero */}
                <div className="support-hero">
                    <h1 className="support-hero__title">How can we help?</h1>
                    <p className="support-hero__sub">
                        Find answers, contact support, or raise a ticket. We are here for you.
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="support-contact-grid">
                    <div className="support-card">
                        <div className="support-card__icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                        </div>
                        <h3 className="support-card__title">Call Us</h3>
                        <p className="support-card__number">{SUPPORT_PHONE}</p>
                        <p className="support-card__hours">{SUPPORT_HOURS}</p>
                        <p className="support-card__note">Toll-free across India</p>
                    </div>

                    <div className="support-card">
                        <div className="support-card__icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </div>
                        <h3 className="support-card__title">Email Us</h3>
                        <p className="support-card__email">
                            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
                        </p>
                        <p className="support-card__hours">Response within 24 hours</p>
                        <p className="support-card__note">For non-urgent queries</p>
                    </div>

                    <div className="support-card support-card--chat" onClick={() => {
                        window.dispatchEvent(new CustomEvent('open-gizmo'));
                    }}>
                        <div className="support-card__icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <h3 className="support-card__title">Chat with GIZMO</h3>
                        <p className="support-card__hours">Available 24/7</p>
                        <p className="support-card__note">AI-powered instant help</p>
                        <span className="support-card__cta">Open Chat &rarr;</span>
                    </div>
                </div>

                {/* FAQs */}
                <div className="support-faq-section">
                    <h2 className="support-section__title">Frequently Asked Questions</h2>
                    <div className="support-faq-list">
                        {faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className={`support-faq ${openFaq === idx ? 'support-faq--open' : ''}`}
                                onClick={() => toggleFaq(idx)}
                            >
                                <div className="support-faq__question">
                                    <span>{faq.q}</span>
                                    <svg className="support-faq__chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9" />
                                    </svg>
                                </div>
                                <div className="support-faq__answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Raise Ticket CTA */}
                <div className="support-ticket-cta">
                    <h2>Still need help?</h2>
                    <p>Our support team is ready to assist you. Raise a ticket and we will get back to you within 24 hours.</p>
                    <div className="support-ticket-cta__actions">
                        <button className="btn-support-primary" onClick={() => window.dispatchEvent(new CustomEvent('open-gizmo'))}>
                            Chat with GIZMO
                        </button>
                        <button className="btn-support-secondary" onClick={() => navigate('/profile')}>
                            View My Tickets
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Support;
