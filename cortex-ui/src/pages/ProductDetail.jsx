import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useChat } from '../context/ChatContext'
import MacBuyLayout from '../components/MacBuyLayout'
import PremiumMacBuyLayout from '../components/PremiumMacBuyLayout'
import PremiumiPadBuyLayout from '../components/PremiumiPadBuyLayout'
import PremiumPhoneBuyLayout from '../components/PremiumPhoneBuyLayout'
import PremiumWatchBuyLayout from '../components/PremiumWatchBuyLayout'
import PremiumAccessoryBuyLayout from '../components/PremiumAccessoryBuyLayout'
import UniversalBuyLayout from '../components/UniversalBuyLayout'
import './ProductDetail.css'

const ProductDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { setProductContext } = useChat()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (product) {
            setProductContext(product)
        }
        return () => setProductContext(null)
    }, [product, setProductContext])

    const fetchProduct = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/products/${id}`)
            const data = await response.json()
            setProduct(data.product)
        } catch (error) {
            console.error('Error fetching product:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProduct()
        window.scrollTo(0, 0)
    }, [id])

    if (loading) {
        return (
            <div className="pd-loading">
                <div className="pd-loading-spinner"></div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="pd-error">
                <h1>Product not found</h1>
                <button className="btn btn-primary" onClick={() => navigate('/')}>Go Home</button>
            </div>
        )
    }

    let LayoutComponent = <UniversalBuyLayout product={product} />
    if (product.category === 'mac') LayoutComponent = <PremiumMacBuyLayout product={product} />
    else if (product.category === 'ipad') LayoutComponent = <PremiumiPadBuyLayout product={product} />
    else if (product.category === 'iphone') LayoutComponent = <PremiumPhoneBuyLayout product={product} />
    else if (product.category === 'watch') LayoutComponent = <PremiumWatchBuyLayout product={product} />
    else if (product.category === 'airpods' || product.category === 'tv-home') LayoutComponent = <PremiumAccessoryBuyLayout product={product} />

    return (
        <div className="product-detail-page-wrapper">
            {LayoutComponent}
        </div>
    )
}

export default ProductDetail
