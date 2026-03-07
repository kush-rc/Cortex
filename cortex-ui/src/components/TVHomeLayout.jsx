import React from 'react'
import { Link } from 'react-router-dom'
import './TVHomeLayout.css'

const TVHomeLayout = ({ products }) => {
    const homepodBig = products.find(p => p.name === 'HomePod')
    const homepodMini = products.find(p => p.name === 'HomePod mini')
    const appleTV = products.find(p => p.name.includes('Apple TV'))

    return (
        <div className="tv-home-outer">
            <div className="tv-home-content">
                <div className="tv-grid-top">
                    {/* HomePod (Dark Card) */}
                    {homepodBig && (
                        <div className="tv-card dark-card">
                            <div className="tv-card-content">
                                <h3 className="tv-eyebrow">{homepodBig.name}</h3>
                                <h2 className="tv-headline">{homepodBig.tagline}</h2>
                                <p className="tv-price">₹{homepodBig.price.toLocaleString('en-IN')}.00*</p>
                                <div className="tv-buttons">
                                    <Link to={`/product/${homepodBig._id}`} className="tv-btn-blue">Buy</Link>
                                    <Link to={`/product/${homepodBig._id}`} className="tv-link">Learn more &gt;</Link>
                                </div>
                            </div>
                            <div className="tv-card-image-container bleed-bottom">
                                <img src={homepodBig.image} alt={homepodBig.name} className="tv-product-img" />
                            </div>
                        </div>
                    )}

                    {/* HomePod mini (Light Card) */}
                    {homepodMini && (
                        <div className="tv-card light-card">
                            <div className="tv-card-content">
                                <h3 className="tv-eyebrow">{homepodMini.name}</h3>
                                <h2 className="tv-headline">{homepodMini.tagline}</h2>
                                <p className="tv-price">₹{homepodMini.price.toLocaleString('en-IN')}.00*</p>
                                <div className="tv-buttons">
                                    <Link to={`/product/${homepodMini._id}`} className="tv-btn-blue">Buy</Link>
                                    <Link to={`/product/${homepodMini._id}`} className="tv-link">Learn more &gt;</Link>
                                </div>
                            </div>
                            <div className="tv-card-image-container bleed-side">
                                <img src={homepodMini.image} alt={homepodMini.name} className="tv-product-img mini-img" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Apple TV 4K (Full Width) */}
                {appleTV && (
                    <div className="tv-card full-width-card">
                        <div className="tv-card-content">
                            <div className="tv-logo-lockup">
                                <span className="apple-icon"></span>TV<span className="tv-4k">4K</span>
                            </div>
                            <h2 className="tv-headline large-headline">The Apple experience.<br />Cinematic in every sense.</h2>
                            <p className="tv-price">Starting from ₹{appleTV.price.toLocaleString('en-IN')}.00*</p>
                            <div className="tv-buttons">
                                <Link to={`/product/${appleTV._id}`} className="tv-btn-blue">Buy</Link>
                                <Link to={`/product/${appleTV._id}`} className="tv-link">Learn more &gt;</Link>
                            </div>
                        </div>
                        <div className="tv-card-image-container atv-container">
                            <img src={appleTV.image} alt={appleTV.name} className="tv-product-img atv-img" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default TVHomeLayout
