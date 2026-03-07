import { useNavigate, useLocation } from 'react-router-dom'
import { useCompare } from '../../context/CompareContext'
import './CompareBar.css'

const CATEGORY_MAP = {
    iphone: 'iPhones', mac: 'Macs', ipad: 'iPads',
    watch: 'Apple Watches', airpods: 'AirPods', 'tv-home': 'TV & Home',
    accessories: 'Accessories',
}

export default function CompareBar() {
    const { compareList, compareCategory, removeFromCompare, clearCompare } = useCompare()
    const navigate = useNavigate()
    const location = useLocation()
    const isComparePage = location.pathname === '/compare'

    if (compareList.length === 0) return null

    return (
        <div className="compare-bar">
            <div className="compare-bar__products">
                {compareList.map(p => (
                    <div key={p.id || p._id} className="compare-bar__item">
                        <img
                            src={p.image || '/static/placeholder.png'}
                            alt={p.name}
                            className="compare-bar__img"
                        />
                        <span className="compare-bar__name">{p.name}</span>
                        <button
                            className="compare-bar__remove"
                            onClick={() => removeFromCompare(p.id || p._id)}
                            aria-label="Remove"
                        >✕</button>
                    </div>
                ))}
                {/* Empty slots */}
                {Array.from({ length: 3 - compareList.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="compare-bar__item compare-bar__item--empty">
                        <div className="compare-bar__empty-slot">+</div>
                        <span className="compare-bar__name compare-bar__name--hint">
                            Add {CATEGORY_MAP[compareCategory] || 'product'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="compare-bar__actions">
                <span className="compare-bar__count">{compareList.length} selected</span>
                <button
                    className="compare-bar__clear"
                    onClick={clearCompare}
                >Clear</button>
                {!isComparePage && (
                    <button
                        className="compare-bar__go"
                        onClick={() => navigate('/compare')}
                        disabled={compareList.length < 2}
                    >
                        Compare Now →
                    </button>
                )}
            </div>
        </div>
    )
}
