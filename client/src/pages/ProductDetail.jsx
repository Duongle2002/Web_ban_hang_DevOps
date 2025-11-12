import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api.js'
import { useCurrency } from '../main.jsx'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState(null)
  const { format } = useCurrency()

  useEffect(() => {
    let ignore = false
    async function fetchProduct() {
      setLoading(true)
      try {
        const res = await api.get(`/products/${id}`)
        if (!ignore) setProduct(res.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
    return () => { ignore = true }
  }, [id])

  async function addToCart() {
    try {
      const res = await api.post('/cart/add', { productId: id, quantity })
      setMessage(res.data.message || 'Added to cart')
    } catch (err) {
      setMessage(err.response?.data?.message || err.message)
    }
    setTimeout(() => setMessage(null), 3000)
  }

  if (loading) return <div className="container py-5">Loading...</div>
  if (error) return <div className="container py-5 text-danger">{error}</div>
  if (!product) return <div className="container py-5">Not found</div>

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6 mb-4">
          <img src={product.image} alt={product.name} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="lead">{format(product.price)}</p>
          <p>{product.description}</p>
          <div className="d-flex align-items-center mb-3">
            <input type="number" min={1} value={quantity} onChange={e => setQuantity(parseInt(e.target.value)||1)} className="form-control w-auto me-2" />
            <button className="btn btn-primary" onClick={addToCart}>Add to cart</button>
          </div>
          {message && <div>{message}</div>}
        </div>
      </div>
    </div>
  )
}
