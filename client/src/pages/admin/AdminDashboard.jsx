import React from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'

const UsersAdmin = React.lazy(()=> import('./UsersAdmin.jsx'))
const ProductsAdmin = React.lazy(()=> import('./ProductsAdmin.jsx'))
const BlogsAdmin = React.lazy(()=> import('./BlogsAdmin.jsx'))

export default function AdminDashboard(){
  return (
    <div className="container py-4">
      <h2 className="mb-3">Admin Dashboard</h2>
      <nav className="nav nav-pills gap-2 mb-3">
        <NavLink className="nav-link" to="users">Users</NavLink>
        <NavLink className="nav-link" to="products">Products</NavLink>
        <NavLink className="nav-link" to="blogs">Blogs</NavLink>
      </nav>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="users" element={<UsersAdmin/>} />
          <Route path="products" element={<ProductsAdmin/>} />
          <Route path="blogs" element={<BlogsAdmin/>} />
        </Routes>
      </React.Suspense>
    </div>
  )
}
