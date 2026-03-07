import { Link, useLocation } from 'react-router-dom'
import './CategoryRibbon.css'

const categories = [
    {
        id: 'iphone',
        label: 'iPhone',
        icon: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-iphone-nav-202309?wid=200&hei=130&fmt=png-alpha',
        path: '/iphone'
    },
    {
        id: 'mac',
        label: 'Mac',
        icon: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-14-16-mac-nav-202301?wid=200&hei=130&fmt=png-alpha',
        path: '/mac'
    },
    {
        id: 'ipad',
        label: 'iPad',
        icon: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-ipad-nav-202210?wid=200&hei=130&fmt=png-alpha',
        path: '/ipad'
    },
    {
        id: 'watch',
        label: 'Apple Watch',
        icon: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-watch-nav-202309?wid=200&hei=130&fmt=png-alpha',
        path: '/watch'
    },
    {
        id: 'airpods',
        label: 'AirPods',
        icon: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-airpods-nav-202209?wid=200&hei=130&fmt=png-alpha',
        path: '/airpods'
    },
    {
        id: 'tv-home',
        label: 'TV & Home',
        icon: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-appletv-nav-202210?wid=200&hei=130&fmt=png-alpha',
        path: '/tv-home'
    },
    {
        id: 'accessories',
        label: 'Accessories',
        icon: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/store-card-13-airtags-nav-202108?wid=200&hei=130&fmt=png-alpha',
        path: '/accessories'
    }
]

const CategoryRibbon = () => {
    const location = useLocation()

    return (
        <div className="category-ribbon">
            <div className="ribbon-container">
                {categories.map(cat => (
                    <Link
                        to={cat.path}
                        key={cat.id}
                        className={`ribbon-item ${location.pathname === cat.path ? 'active' : ''}`}
                    >
                        <div className="ribbon-icon-wrapper">
                            <img src={cat.icon} alt={cat.label} className="ribbon-icon" />
                        </div>
                        <span className="ribbon-label">{cat.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CategoryRibbon
