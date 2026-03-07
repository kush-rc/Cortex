import { Link, useNavigate } from 'react-router-dom'
import './ProductCard.css'

const ProductCard = ({ product }) => {
    const navigate = useNavigate()

    // Handle "New" badge logic based on product data or simple logic
    const isNew = product.new

    return (
        <div className="product-card light" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="product-info">
                {isNew && <span className="product-tag">New</span>}
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.tagline}</p>
                <p className="product-price">From ₹{product.price?.toLocaleString('en-IN')}</p>

                <div className="product-actions">
                    <button
                        className="btn-buy"
                        onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/product/${product.id}`)
                        }}
                    >
                        Buy
                    </button>
                    <Link
                        to={`/product/${product.id}`}
                        className="btn-learn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Learn more &gt;
                    </Link>
                </div>
            </div>

            <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} className="product-image" />
            </div>
        </div>
    )
}

export default ProductCard
