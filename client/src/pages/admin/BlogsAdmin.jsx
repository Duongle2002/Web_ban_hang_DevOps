import React, { useEffect, useState } from 'react'
import api from '../../services/api'

export default function BlogsAdmin(){
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load(){
    setLoading(true)
    try{
  const res = await api.get('/admin/blogs')
  setBlogs(res.data.blogs || res.data || [])
    }catch(e){ setError(e.response?.data?.message||e.message) }
    finally{ setLoading(false) }
  }
  useEffect(()=>{ load() },[])

  return (
    <div>
      <h4>Blogs</h4>
      {error && <div className='alert alert-danger'>{error}</div>}
      {loading ? <div>Loading...</div> : (
        <ul className='list-group'>
          {blogs.map(b=> (<li key={b._id} className='list-group-item d-flex justify-content-between align-items-center'>
            <span>{b.title}</span>
            <small className='text-muted'>{new Date(b.date).toLocaleDateString()}</small>
          </li>))}
        </ul>
      )}
    </div>
  )
}
