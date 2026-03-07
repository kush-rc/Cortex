import { Link } from 'react-router-dom'
import './Store.css'

const Store = () => {
    const storeSections = [
        { title: 'Mac', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-14-16-mac-nav-202301?wid=400&hei=260&fmt=png-alpha', link: '/mac' },
        { title: 'iPhone', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-iphone-nav-202309?wid=400&hei=260&fmt=png-alpha', link: '/iphone' },
        { title: 'iPad', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-ipad-nav-202210?wid=400&hei=260&fmt=png-alpha', link: '/ipad' },
        { title: 'Apple Watch', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-watch-nav-202309?wid=400&hei=260&fmt=png-alpha', link: '/watch' },
        { title: 'AirPods', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-airpods-nav-202209?wid=400&hei=260&fmt=png-alpha', link: '/airpods' },
        { title: 'AirTag', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-airtags-nav-202108?wid=400&hei=260&fmt=png-alpha', link: '/accessories' },
        { title: 'Apple TV 4K', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-appletv-nav-202210?wid=400&hei=260&fmt=png-alpha', link: '/tv-home' },
        { title: 'HomePod', image: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-homepod-nav-202301?wid=400&hei=260&fmt=png-alpha', link: '/tv-home' },
    ]

    return (
        <div className="store-page">
            <div className="store-header container-wide">
                <h1 className="headline-super">Store. <span style={{ color: '#6e6e73' }}>The best way to buy the products you love.</span></h1>
            </div>

            <div className="store-shelf container-wide">
                {storeSections.map((section, idx) => (
                    <Link to={section.link} key={idx} className="store-card">
                        <img src={section.image} alt={section.title} className="store-card-img" />
                        <span className="store-card-title">{section.title}</span>
                    </Link>
                ))}
            </div>

            <div className="container-wide" style={{ marginTop: 60 }}>
                <h2 className="headline-large">The latest. <span style={{ color: '#6e6e73' }}>Take a look at what’s new right now.</span></h2>
                {/* We could reuse ProductCards horizontally here later */}
            </div>

            <div className="help-banner container-wide">
                <div className="help-content">
                    <h2 className="headline-small">Need shopping help?</h2>
                    <p className="body-text">Ask a Specialist</p>
                </div>
                <img
                    src="https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-50-specialist-help-202309?wid=960&hei=1000&fmt=p-jpg"
                    alt="Specialist"
                    className="help-img"
                />
            </div>
        </div>
    )
}

export default Store
