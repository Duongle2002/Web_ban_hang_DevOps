import React, { useEffect, useState } from 'react'
import api from '../services/api.js'
import { Link, useNavigate } from 'react-router-dom'
import { useCurrency } from '../main.jsx'

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { currency, format, rate } = useCurrency()

  async function loadCart() {
    setLoading(true)
    try {
      const res = await api.get('/cart')
      setCart(res.data.cart)
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login')
      } else {
        setError(err.response?.data?.message || err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadCart() }, [])

  async function updateQuantity(productId, quantity) {
    try {
      const res = await api.put('/cart/update', { productId, quantity })
      setCart(res.data.cart)
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    }
  }

  async function removeItem(productId) {
    try {
      const res = await api.delete('/cart/remove', { data: { productId } })
      setCart(res.data.cart)
    } catch (err) {
      setError(err.response?.data?.message || 'Remove failed')
    }
  }

  if (loading) return <div className="container py-5">Loading cart...</div>
  if (error) return <div className="container py-5 text-danger">{error}</div>
  const items = cart?.items || []
  const subtotalUSD = cart?.subtotal || 0
  const subtotalDisplay = currency === 'USD' ? subtotalUSD.toFixed(2) : (Math.round(subtotalUSD * rate)).toLocaleString('vi-VN') + '₫'

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Cart</h2>
      {items.length === 0 && <p>Your cart is empty.</p>}
      {items.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.productId._id}>
                <td>{item.productId.name}</td>
                <td>{format(item.productId.price)}</td>
                <td style={{width:120}}>
                  <input type="number" min={1} value={item.quantity} onChange={e=>updateQuantity(item.productId._id, parseInt(e.target.value)||1)} className="form-control" />
                </td>
                <td>{format(item.productId.price * item.quantity)}</td>
                <td><button className="btn btn-sm btn-outline-danger" onClick={()=>removeItem(item.productId._id)}>x</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="d-flex justify-content-between align-items-center mt-4">
  <strong>Subtotal: {currency === 'USD' ? `$${subtotalUSD.toFixed(2)}` : subtotalDisplay}</strong>
        {items.length > 0 && <Link to="/checkout" className="btn btn-primary">Checkout</Link>}
      </div>
    </div>
  )
}
