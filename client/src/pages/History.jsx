import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { Link } from 'react-router-dom'

export default function History() {
  const [orders, setOrders] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async (p = 1, s = '') => {
    setLoading(true)
    try {
      const res = await api.get(`/history?page=${p}&search=${encodeURIComponent(s)}`)
      setOrders(res.data.orders || [])
      setPage(res.data.currentPage || 1)
      setTotalPages(res.data.totalPages || 1)
    } catch (e) {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(1, '') }, [])

  function onSubmit(e){ e.preventDefault(); load(1, search) }

  return (
    <div>
      <section className="hero" style={{backgroundImage: "url(/images/bg_2.jpg)", backgroundSize:'cover'}}>
        <div className="overlay" />
        <div className="container py-5">
          <div className="text-center text-white" style={{minHeight:'200px', display:'flex', alignItems:'end', justifyContent:'center'}}>
            <div>
              <p className="mb-1"><Link className="text-white" to="/">Home</Link> / Order History</p>
              <h2>Order History</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <form className="mb-3" onSubmit={onSubmit}>
            <div className="input-group">
              <input className="form-control" placeholder="Search by order ID or name" value={search} onChange={e=>setSearch(e.target.value)} />
              <button className="btn btn-primary" type="submit">Search</button>
            </div>
          </form>

          {loading ? <div>Loading...</div> : (
            orders.length ? orders.map(order => (
              <div className="mb-4" key={order._id}>
                <h5>Order #{order._id} - <span className={`badge bg-secondary`}>{order.status}</span></h5>
                <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
                    </thead>
                    <tbody>
                      {(order.products||[]).map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.productId?.name}</td>
                          <td>{item.quantity}</td>
                          <td>${Number(item.productId?.price||0).toFixed(2)}</td>
                          <td>${(Number(item.productId?.price||0) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="fw-bold">Total: ${Number(order.totalPrice||0).toFixed(2)}</div>
                  <Link className="btn btn-outline-primary" to={`/history/${order._id}`}>View Details</Link>
                </div>
              </div>
            )) : <p>No orders found.</p>
          )}

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${page<=1?'disabled':''}`}>
                  <button className="page-link" onClick={()=> load(page-1, search)}>{'<'}</button>
                </li>
                {Array.from({length: totalPages}, (_,i)=>i+1).map(n => (
                  <li key={n} className={`page-item ${n===page?'active':''}`}>
                    <button className="page-link" onClick={()=> load(n, search)}>{n}</button>
                  </li>
                ))}
                <li className={`page-item ${page>=totalPages?'disabled':''}`}>
                  <button className="page-link" onClick={()=> load(page+1, search)}>{'>'}</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>
    </div>
  )
}
