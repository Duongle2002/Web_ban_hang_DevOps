import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'
import { useCurrency } from '../main.jsx'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 9
  const { format } = useCurrency()

  useEffect(() => {
    let ignore = false
    async function fetchProducts() {
      setLoading(true)
      try {
        const res = await api.get('/products', { params: { page, limit } })
        if (!ignore) {
          setProducts(res.data.products || res.data.data || [])
          setTotal(res.data.total || res.data.totalProducts || 0)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
    return () => { ignore = true }
  }, [page])

  const totalPages = Math.ceil(total / limit) || 1

  return (
    <div className="container py-5">
      <h1 className="mb-4">Products</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      <div className="row">
        {products.map(p => (
          <div className="col-md-4 mb-4" key={p._id}>
            <div className="card h-100">
              <div className="card-img-top d-flex align-items-center justify-content-center" style={{backgroundSize:'cover',backgroundImage:`url(${p.image})`,height:'220px'}}>
                <div className="badge bg-dark text-white position-absolute top-0 end-0 m-2">{p.category}</div>
              </div>
              <div className="card-body text-center">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text mb-1">{format(p.price)}</p>
                <Link to={`/product/${p._id}`} className="btn btn-sm btn-primary">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}> <button className="page-link" onClick={() => setPage(p => p - 1)}>&lt;</button></li>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
            <li key={num} className={`page-item ${num === page ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(num)}>{num}</button>
            </li>
          ))}
          <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}> <button className="page-link" onClick={() => setPage(p => p + 1)}>&gt;</button></li>
        </ul>
      </nav>
    </div>
  )
}
