import { createContext, useContext, useState } from 'react'

const CompareContext = createContext()

export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([])
    const [compareCategory, setCompareCategory] = useState(null) // 'iphone', 'mac', etc.

    const addToCompare = (product) => {
        if (compareList.length >= 3) return
        if (compareList.find(p => p.id === product.id)) return
        // Lock category on first add
        if (!compareCategory) setCompareCategory(product.category)
        setCompareList(prev => [...prev, product])
    }

    const removeFromCompare = (productId) => {
        setCompareList(prev => {
            const next = prev.filter(p => p.id !== productId)
            if (next.length === 0) setCompareCategory(null)
            return next
        })
    }

    const clearCompare = () => {
        setCompareList([])
        setCompareCategory(null)
    }

    const isInCompare = (productId) => compareList.some(p => p.id === productId)

    const canCompare = (product) => {
        if (compareList.length >= 3) return false
        if (compareCategory && product.category !== compareCategory) return false
        if (isInCompare(product.id)) return false
        return true
    }

    return (
        <CompareContext.Provider value={{
            compareList,
            compareCategory,
            addToCompare,
            removeFromCompare,
            clearCompare,
            isInCompare,
            canCompare
        }}>
            {children}
        </CompareContext.Provider>
    )
}

export const useCompare = () => useContext(CompareContext)
