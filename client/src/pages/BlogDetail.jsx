import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api.js'

export default function BlogDetail() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      try {
        const res = await api.get(`/blogs/${id}`)
        const data = res.data?.data || null
        if (!ignore) setBlog(data)
      } catch (e) {
        setError(e.response?.data?.message || e.message)
      } finally { setLoading(false) }
    }
    load()
    return () => { ignore = true }
  }, [id])

  if (loading) return <div className="container py-5">Loading...</div>
  if (error) return <div className="container py-5 text-danger">{error}</div>
  if (!blog) return <div className="container py-5">Not found</div>

  return (
    <div className="container py-5" style={{maxWidth: "850px"}}>
      <Link to="/blog" className="btn btn-link mb-3">← Back to Blog</Link>
      {blog.image && <img src={blog.image} alt={blog.title} className="img-fluid rounded mb-4" />}
      <h1 className="mb-3">{blog.title}</h1>
      <div className="text-muted mb-4">{blog.date ? new Date(blog.date).toLocaleDateString() : ''}</div>
      <article className="lead" dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  )
}
