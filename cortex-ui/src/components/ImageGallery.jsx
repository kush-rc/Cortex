import React, { useState, useCallback } from 'react'
import { useChat } from '../context/ChatContext'
import QuickQuestions from './ChatWidget/QuickQuestions'
import './ImageGallery.css'

const ImageGallery = ({ images = [], alt = 'Product' }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const { openChat, productContext } = useChat()

    // Fallback if no images
    if (!images || images.length === 0) return null

    const goTo = useCallback((index) => {
        setCurrentIndex(index)
    }, [])

    const goPrev = useCallback(() => {
        setCurrentIndex(prev => Math.max(0, prev - 1))
    }, [])

    const goNext = useCallback(() => {
        setCurrentIndex(prev => Math.min(images.length - 1, prev + 1))
    }, [images.length])

    const isFirst = currentIndex === 0
    const isLast = currentIndex === images.length - 1

    // Single image — no controls needed
    if (images.length === 1) {
        return (
            <div className="image-gallery">
                <div className="image-gallery__viewport">
                    <div className="image-gallery__track">
                        <div className="image-gallery__slide">
                            <img src={images[0]} alt={alt} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="image-gallery">
            <div className="image-gallery__viewport">
                <div
                    className="image-gallery__track"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {images.map((img, i) => (
                        <div key={i} className="image-gallery__slide">
                            <img
                                src={img}
                                alt={`${alt} - ${i + 1}`}
                                loading={i === 0 ? 'eager' : 'lazy'}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Bar: Controls + Ask Gizmo */}
            <div className="image-gallery__bottom-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px', gap: '16px' }}>
                <div className="image-gallery__control-row" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

                    {/* Apple-style controls: ‹  • • •  › */}
                    <div className="image-gallery__controls" style={{ margin: 0 }}>
                        <button
                            className="image-gallery__arrow"
                            onClick={goPrev}
                            disabled={isFirst}
                            aria-label="Previous image"
                        >
                            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor">
                                <path d="M9 2 L4 7 L9 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="image-gallery__dots">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    className={`image-gallery__dot ${i === currentIndex ? 'image-gallery__dot--active' : ''}`}
                                    onClick={() => goTo(i)}
                                    aria-label={`Go to image ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            className="image-gallery__arrow"
                            onClick={goNext}
                            disabled={isLast}
                            aria-label="Next image"
                        >
                            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor">
                                <path d="M5 2 L10 7 L5 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    <button
                        className="btn-ask-gizmo"
                        onClick={() => openChat('', productContext)}
                        style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '980px' }}
                    >
                        Ask GIZMO
                        <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '6px' }}>
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>

                <div className="image-gallery__quick-questions" style={{ maxWidth: '400px' }}>
                    <QuickQuestions
                        category={productContext?.category || 'general'}
                        onSelect={(q) => openChat(q, productContext)}
                    />
                </div>
            </div>
        </div>
    )
}

export default ImageGallery
