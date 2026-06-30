import React from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import { setAuthToken } from '../services/api.js'
import { useCurrency } from '../main.jsx'

export default function Header() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  function logout() {
    // Clear token and auth header, reset user
    localStorage.removeItem('token')
    setAuthToken(null)
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="bg-dark text-white">
      <nav className="container navbar navbar-expand-lg navbar-dark">
        <Link className="navbar-brand" to="/">Liquor Store</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/">Home</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/product">Products</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/blog">Blog</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/contact">Contact</NavLink></li>
            {user && (
              <li className="nav-item"><NavLink className="nav-link" to="/history">Order History</NavLink></li>
            )}
            {user?.role === 'Admin' && (
              <li className="nav-item"><NavLink className="nav-link" to="/admin">Admin</NavLink></li>
            )}
          </ul>
          <ul className="navbar-nav align-items-center">
            {/* Currency switch */}
            <li className="nav-item me-3">
              <div className="d-flex align-items-center">
                <span className="me-2 small text-white-50">Currency</span>
                <CurrencySwitcher />
              </div>
            </li>
            {user ? (
              <>
                <li className="nav-item me-2">
                  <span className="nav-link disabled">Hello, {user.name}</span>
                </li>
                <li className="nav-item"><NavLink className="nav-link" to="/cart">Cart</NavLink></li>
                <li className="nav-item ms-2">
                  <button className="btn btn-sm btn-outline-light" onClick={logout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/signup">Signup</NavLink></li>
                <li className="nav-item"><NavLink className="nav-link" to="/cart">Cart</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  )
}

function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency()
  return (
    <select className="form-select form-select-sm bg-dark text-white border-secondary" style={{ width: 90 }} value={currency} onChange={e=>setCurrency(e.target.value)}>
      <option value="USD">USD</option>
      <option value="VND">VND</option>
    </select>
  )
}
