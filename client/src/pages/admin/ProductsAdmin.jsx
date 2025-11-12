import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function ProductsAdmin(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load(){
    setLoading(true)
    try{
  const res = await api.get('/admin/products')
  setProducts(res.data.products || res.data || [])
    }catch(e){ setError(e.response?.data?.message||e.message) }
    finally{ setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  return (
    <div>
      <h4>Products</h4>
      {error && <div className='alert alert-danger'>{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div className='table-responsive'>
          <table className='table'>
            <thead><tr><th>Name</th><th>Category</th><th>Price</th></tr></thead>
            <tbody>
              {products.map(p=> (
                <tr key={p._id}><td>{p.name}</td><td>{p.category}</td><td>${Number(p.price||0).toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
