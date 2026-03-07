import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppleLogo from './AppleLogo'
import './Footer.css'

const Footer = () => {
    const location = useLocation();

    // Breadcrumb Logic
    const getBreadcrumbs = () => {
        const path = location.pathname;
        const appleLogoSvg = (
            <AppleLogo className="footer-apple-icon" width="14" height="14" style={{ marginBottom: '-2px' }} />
        );

        const crumbs = [<Link to="/" key="home" className="footer-breadcrumb-icon">{appleLogoSvg}</Link>];

        if (path === '/') return crumbs;

        const segments = path.split('/').filter(Boolean);
        segments.forEach((segment, index) => {
            const name = segment.charAt(0).toUpperCase() + segment.slice(1);
            crumbs.push(<span key={`sep-${index}`} className="footer-breadcrumb-sep">{' › '}</span>);
            // Last item is text, others links? For now just text or link to category
            // Simplified: Link to the segment
            crumbs.push(<Link to={`/${segment}`} key={segment} className="footer-breadcrumb-text">{name}</Link>);
        });

        return crumbs;
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-top-text">
                    <p>* Apple Education Pricing is available to current and newly accepted college students and their parents, as well as teachers and staff at all levels. For more information, visit apple.com/in-edu/store.</p>
                    <p>** From 15 January 2026 through 23 February 2026, No Cost EMI is available with education savings to Qualified Purchasers when purchasing an eligible Mac or iPad using qualifying cards from most leading card issuers. No Cost EMI is available with the purchase of an eligible iPad (A16) or iPad Air made using qualifying cards on 3- or 6-month tenures and on an eligible MacBook Air or MacBook Pro on 3-, 6-, 9- or 12-month tenures. Verification is required. Quantity limits apply. Monthly pricing is rounded to the nearest rupee. Exact pricing will be provided by your card issuer, subject to your card issuer’s terms and conditions. Minimum order spend applies as per your card issuer’s threshold. No Cost EMI is not available to business customers and cannot be combined with Corporate Employee Purchase Plan pricing. Card eligibility is subject to terms and conditions between you and your card issuer. Offer may be revised or withdrawn at any time without any prior notice. Terms apply.</p>
                    <p>*** Listed pricing is Maximum Retail Price (inclusive of all taxes).</p>
                    <p>**** Includes instant cashback and No Cost EMI.</p>
                    <br />
                    <p>No Cost EMI is available with the purchase of an eligible product made using qualifying cards on 3- or 6-month tenures from most leading card issuers. Monthly pricing is rounded to the nearest rupee. Exact pricing will be provided by your card issuer, subject to your card issuer’s terms and conditions. Minimum order spend applies as per your card issuer’s threshold. No Cost EMI is not available to business customers and cannot be combined with Apple Store for Education or Corporate Employee Purchase Plan pricing. Card eligibility is subject to terms and conditions between you and your card issuer. Offer may be revised or withdrawn at any time without any prior notice. Terms apply.</p>
                    <br />
                    <p>Instant cashback is available with the purchase of an eligible product with qualifying American Express, Axis Bank and ICICI Bank cards only. Minimum transaction value of ₹10001 applies. Click here to see instant cashback amounts and eligible devices. Instant cashback is available for up to two orders per rolling 90-day period with an eligible card. Card eligibility is subject to terms and conditions between you and your card issuer. Total transaction value is calculated after any trade-in credit or eligible discount is applied. Any subsequent order adjustment(s) or cancellation(s) may result in instant cashback being recalculated, and any refund may be adjusted to account for instant cashback clawback; this may result in no refund being made to you. Offer may be revised or withdrawn at any time without any prior notice. Additional terms apply. Instant cashback is not available to business customers and cannot be combined with Apple Store for Education or Corporate Employee Purchase Plan pricing. Multiple separate orders cannot be combined for instant cashback.</p>
                    <p>***** No Cost EMI is available with the purchase of an eligible product made using qualifying cards on 3- or 6-month tenures from most leading card issuers. Monthly pricing is rounded to the nearest rupee. Exact pricing will be provided by your card issuer, subject to your card issuer’s terms and conditions. Minimum order spend applies as per your card issuer’s threshold. No Cost EMI is not available to business customers and cannot be combined with Apple Store for Education or Corporate Employee Purchase Plan pricing. Card eligibility is subject to terms and conditions between you and your card issuer. Offer may be revised or withdrawn at any time without any prior notice. Terms apply.</p>
                    <p>◊ Available payment types may differ between Apple Stores and Apple Store Online.</p>
                    <p>Mac, iPad and Apple Watch trade-in is available only in-store in India. Apple Retail Online in India does not offer trade-in for Mac, iPad and Apple Watch. Trade‑in values will vary based on the condition, year and configuration of your eligible trade‑in device. Not all devices are eligible for credit. You must be at least the age of majority to be eligible to trade in for credit. Trade‑in value may be applied towards a qualifying new device purchase. Actual value awarded is based on receipt of a qualifying device matching the description provided when estimate was made. Sales tax may be assessed on full value of a new device purchase. In-store trade‑in requires presentation of a valid photo ID (local law may require saving this information). Some stores may have additional requirements. Apple or trade-in partners reserve the right to refuse, cancel or limit the quantity of any trade‑in transaction for any reason. More details are available from Apple’s trade‑in partner for trade‑in and recycling of eligible devices. Restrictions and limitations may apply.</p>
                    <p>Software and content may be sold separately. Title availability is subject to change.</p>
                    <p>Testing conducted by Apple from August through October 2024 using pre-production 16″ MacBook Pro systems with Apple M4 Pro, 14‑core CPU, 20‑core GPU, 48GB of RAM and 512GB SSD. Wireless web battery life tested by browsing 25 popular websites while connected to Wi-Fi. Video streaming battery life tested with 1080p content in Safari while connected to Wi-Fi. All systems tested with display brightness set to 8 clicks from the bottom and keyboard backlight off. Battery life varies by use and configuration. See apple.com/in/batteries for more information.</p>
                    <p>Apple Intelligence is available in beta. Some features may not be available in all regions or languages. For feature and language availability and system requirements, see support.apple.com/121115.</p>
                    <p>Available on Mac computers with Apple silicon and Intel-based Mac computers with a T2 Security Chip. Requires that your iPhone and Mac are signed in with the same Apple Account using two-factor authentication, your iPhone and Mac are near each other and have Bluetooth and Wi-Fi turned on, and your Mac is not using AirPlay or Sidecar. Some iPhone features (e.g. camera and microphone) are not compatible with iPhone Mirroring.</p>
                    <p>Requires that your iPhone, with an active carrier plan, and Mac are signed in with the same Apple Account, your iPhone and Mac are near each other, signed in to FaceTime with the same Apple Account, have Wi‑Fi turned on, and are connected to the same network. An external microphone or headset is required for Mac Studio, Mac mini and Mac Pro.</p>
                    <p>Handoff requires an iPhone or iPad with iOS 8 or later or iPadOS.</p>
                    <p>Some features may not be available in all regions or all languages.</p>
                    <p>Some features require an Apple Account, compatible hardware and compatible internet access or cellular network; additional fees and terms may apply.</p>
                    <p>Some features require specific hardware and software. For more information, see support.apple.com/en-in/108046.</p>
                    <p>Stellarium image of the M31 galaxy by Lee, Ang (HG731GZ). Creative Commons Attribution License 3.0.</p>
                </div>

                <div className="footer-breadcrumbs">
                    {getBreadcrumbs()}
                </div>

                <div className="footer-links">
                    <div className="footer-column">
                        <h3>Shop and Learn</h3>
                        <ul>
                            <li><Link to="/store">Store</Link></li>
                            <li><Link to="/mac">Mac</Link></li>
                            <li><Link to="/ipad">iPad</Link></li>
                            <li><Link to="/iphone">iPhone</Link></li>
                            <li><Link to="/watch">Watch</Link></li>
                            <li><Link to="/airpods">AirPods</Link></li>
                            <li><Link to="/tv-home">TV & Home</Link></li>
                            <li><Link to="/airtag">AirTag</Link></li>
                            <li><Link to="/accessories">Accessories</Link></li>
                            <li><Link to="/gift-cards">Gift Cards</Link></li>
                        </ul>
                        <h3>Apple Wallet</h3>
                        <ul>
                            <li><Link to="#">Wallet</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Account</h3>
                        <ul>
                            <li><Link to="/profile">Manage Your Apple Account</Link></li>
                            <li><Link to="/profile">Apple Store Account</Link></li>
                            <li><Link to="#">iCloud.com</Link></li>
                        </ul>
                        <h3>Entertainment</h3>
                        <ul>
                            <li><Link to="#">Apple One</Link></li>
                            <li><Link to="#">Apple TV+</Link></li>
                            <li><Link to="#">Apple Music</Link></li>
                            <li><Link to="#">Apple Arcade</Link></li>
                            <li><Link to="#">Apple Fitness+</Link></li>
                            <li><Link to="#">Apple Podcasts</Link></li>
                            <li><Link to="#">Apple Books</Link></li>
                            <li><Link to="#">App Store</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Apple Store</h3>
                        <ul>
                            <li><Link to="#">Find a Store</Link></li>
                            <li><Link to="#">Genius Bar</Link></li>
                            <li><Link to="#">Today at Apple</Link></li>
                            <li><Link to="#">Group Reservations</Link></li>
                            <li><Link to="#">Apple Camp</Link></li>
                            <li><Link to="#">Apple Trade In</Link></li>
                            <li><Link to="#">Ways to Buy</Link></li>
                            <li><Link to="#">Recycling Programme</Link></li>
                            <li><Link to="#">Order Status</Link></li>
                            <li><Link to="#">Shopping Help</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>For Business</h3>
                        <ul>
                            <li><Link to="#">Apple and Business</Link></li>
                            <li><Link to="#">Shop for Business</Link></li>
                        </ul>
                        <h3>For Education</h3>
                        <ul>
                            <li><Link to="#">Apple and Education</Link></li>
                            <li><Link to="#">Shop for Education</Link></li>
                            <li><Link to="#">Shop for University</Link></li>
                        </ul>
                        <h3>For Healthcare</h3>
                        <ul>
                            <li><Link to="#">Apple in Healthcare</Link></li>
                            <li><Link to="#">Health on Apple Watch</Link></li>
                        </ul>
                        <h3>For Government</h3>
                        <ul>
                            <li><Link to="#">Shop for Government</Link></li>
                            <li><Link to="#">Apple and Government</Link></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h3>Apple Values</h3>
                        <ul>
                            <li><Link to="#">Accessibility</Link></li>
                            <li><Link to="#">Education</Link></li>
                            <li><Link to="#">Environment</Link></li>
                            <li><Link to="#">Privacy</Link></li>
                            <li><Link to="#">Supply Chain Innovation</Link></li>
                        </ul>
                        <h3>About Apple</h3>
                        <ul>
                            <li><Link to="#">Newsroom</Link></li>
                            <li><Link to="#">Apple Leadership</Link></li>
                            <li><Link to="#">Career Opportunities</Link></li>
                            <li><Link to="#">Investors</Link></li>
                            <li><Link to="#">Ethics & Compliance</Link></li>
                            <li><Link to="#">Events</Link></li>
                            <li><Link to="#">Contact Apple</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <div className="footer-shop-text">
                        More ways to shop: <Link to="#">Find an Apple Store</Link> or <Link to="#">other retailer</Link> near you. Or call 000800 040 1966.
                    </div>
                    <div className="footer-copyright-row">
                        <div className="footer-copyright">
                            <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#6e6e73' }}>
                                <strong>Disclaimer:</strong> Cortex is a mock e-commerce portfolio project created for educational purposes. All product names, logos, and brands are property of their respective owners. No actual products are sold.
                            </p>
                            Copyright © {new Date().getFullYear()} Cortex Portfolio Project. All rights reserved.
                        </div>
                        <ul className="footer-legal-links">
                            <li><Link to="#">Privacy Policy</Link></li>
                            <li><Link to="#">Terms of Use</Link></li>
                            <li><Link to="#">Sales Policy</Link></li>
                            <li><Link to="#">Legal</Link></li>
                            <li><Link to="#">Site Map</Link></li>
                        </ul>
                        <div className="footer-locale">
                            <Link to="#">India</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
