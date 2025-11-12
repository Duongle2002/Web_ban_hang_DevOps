import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useParams, Link } from 'react-router-dom'

export default function OrderDetail(){
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [status, setStatus] = useState(null)

  useEffect(()=>{
    api.get(`/history/${id}`).then(res=> setOrder(res.data)).catch(e=> setStatus(e.response?.data?.message||'Error'))
  },[id])

  async function cancel(){
    if (!window.confirm('Cancel this order?')) return
    try {
      const res = await api.post(`/history/${id}/cancel`)
      setStatus(res.data.message)
      setTimeout(()=> window.location.reload(), 1000)
    } catch(e){
      setStatus(e.response?.data?.message || e.message)
    }
  }

  if(!order) return <div className="container py-5">Loading order...</div>

  return (
    <div>
      <section className="hero" style={{backgroundImage: "url(/images/bg_2.jpg)", backgroundSize:'cover'}}>
        <div className="overlay" />
        <div className="container py-5">
          <div className="text-center text-white" style={{minHeight:'200px', display:'flex', alignItems:'end', justifyContent:'center'}}>
            <div>
              <p className="mb-1"><Link className="text-white" to="/">Home</Link> / <Link className="text-white" to="/history">History</Link> / Order #{order._id}</p>
              <h2>Order Detail</h2>
            </div>
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container">
          {status && <div className="alert alert-info">{status}</div>}
          <h4>Order #{order._id} - <span className="badge bg-secondary">{order.status}</span></h4>
          <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
          <div className="table-responsive">
            <table className="table">
              <thead><tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr></thead>
              <tbody>
                {(order.products||[]).map((item,i)=>(
                  <tr key={i}>
                    <td>{item.productId?.name}</td>
                    <td>{item.quantity}</td>
                    <td>${Number(item.productId?.price||0).toFixed(2)}</td>
                    <td>${(Number(item.productId?.price||0)*item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <h5>Total: ${Number(order.totalPrice||0).toFixed(2)}</h5>
          <p><strong>Shipping:</strong> {order.shippingInfo?.firstname} {order.shippingInfo?.lastname}, {order.shippingInfo?.streetaddress}, {order.shippingInfo?.towncity}, {order.shippingInfo?.country}</p>
          <p><strong>Phone:</strong> {order.shippingInfo?.phone} | <strong>Email:</strong> {order.shippingInfo?.email}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
          {order.statusHistory?.length ? (
            <div className="mt-3">
              <h6>Status History</h6>
              <ul>
                {order.statusHistory.map((s,idx)=>(<li key={idx}>{s.status} - {new Date(s.timestamp).toLocaleString()}</li>))}
              </ul>
            </div>
          ) : null}
          {order.status === 'Pending' && <button className="btn btn-danger" onClick={cancel}>Cancel Order</button>}
        </div>
      </section>
    </div>
  )
}
