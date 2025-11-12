import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api.js'

export default function BlogList() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      try {
        const res = await api.get('/blogs')
        const data = res.data?.data || []
        if (!ignore) setBlogs(data)
      } catch (e) {
        setError(e.response?.data?.message || e.message)
      } finally { setLoading(false) }
    }
    load()
    return () => { ignore = true }
  }, [])

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h1>Blog</h1>
        <p className="text-muted">Latest posts and updates</p>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      <div className="row g-4">
        {blogs.map(b => (
          <div className="col-md-4" key={b._id}>
            <div className="card h-100">
              {b.image && (
                <div className="ratio ratio-16x9">
                  <img src={b.image} alt={b.title} className="card-img-top object-fit-cover" />
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <div className="small text-muted mb-2">{b.date ? new Date(b.date).toLocaleDateString() : ''}</div>
                <h5 className="card-title">{b.title}</h5>
                <p className="card-text flex-grow-1">{b.description}</p>
                <Link to={`/blog/${b._id}`} className="btn btn-primary mt-auto">Continue →</Link>
              </div>
            </div>
          </div>
        ))}
        {!loading && blogs.length === 0 && (
          <div className="text-center text-muted">No blogs found.</div>
        )}
      </div>
    </div>
  )
}
