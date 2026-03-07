import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import AppleLogo from './AppleLogo'
import './HeroSection.css'

/**
 * Apple-style hero section
 * @param {string} title - Large headline
 * @param {string} subtitle - Subheading text
 * @param {string} ctaText - Primary CTA button text
 * @param {string} ctaLink - Primary CTA link
 * @param {string} secondaryText - Secondary link text
 * @param {string} secondaryLink - Secondary link
 * @param {string} theme - 'dark' | 'light'
 * @param {string} gradient - CSS gradient for background text
 * @param {string} emoji - Large emoji/icon
 * @param {string} size - 'large' | 'medium' | 'small'
 */
const HeroSection = ({
    title,
    titleLight,
    subtitle,
    ctaText = 'Learn more',
    ctaLink = '#',
    secondaryText,
    secondaryLink,
    theme = 'dark',
    gradient,
    emoji,
    size = 'large',
    bgImage,
    appleLogo,
    children,
    unitId = 'hero-unit',
    imageStyle = {}
}) => {
    const sectionRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                }
            },
            { threshold: 0.15 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section
            ref={sectionRef}
            className={`homepage-section collection-module hero-${theme} hero-${size}`}
            data-module-template="heroes"
        >
            <div data-unit-id={unitId} data-analytics-section-engagement={`name:${unitId}`}>
                <div className="module-content">
                    <div className="unit-wrapper">
                        {/* Full clickable area link */}
                        <Link to={ctaLink} className="unit-link" aria-label={title} aria-hidden="true" tabIndex="-1">&nbsp;</Link>

                        <div className="unit-copy-wrapper">
                            {appleLogo && (
                                <h2 className="headline logo-headline">
                                    <AppleLogo className="hero-apple-icon" viewBox="0 14 14 17" />
                                    <span className="headline-text-bold">{title}</span>
                                    {titleLight && <span className="headline-text-light">{titleLight}</span>}
                                </h2>
                            )}
                            {!appleLogo && (
                                <h2 className={`headline ${gradient ? 'text-gradient' : ''}`}>
                                    {title}
                                </h2>
                            )}

                            {subtitle && <p className="subhead">{subtitle}</p>}

                            <div className="cta-links">
                                <Link to={ctaLink} className="button button-elevated button-primary">{ctaText}</Link>
                                {secondaryText && (
                                    <Link to={secondaryLink || '#'} className="button button-elevated button-tertiary">{secondaryText}</Link>
                                )}
                            </div>
                        </div>

                        {children}

                        {/* Hero Image */}
                        {bgImage && (
                            <div className="unit-image-wrapper">
                                <img
                                    className="unit-image"
                                    src={bgImage}
                                    alt={title}
                                    style={imageStyle}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection
