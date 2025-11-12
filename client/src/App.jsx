import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import ProductList from './pages/ProductList.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Cart from './pages/Cart.jsx'
import BlogList from './pages/BlogList.jsx'
import BlogDetail from './pages/BlogDetail.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Checkout from './pages/Checkout.jsx'
import History from './pages/History.jsx'
import OrderDetail from './pages/OrderDetail.jsx'
import { lazy, Suspense } from 'react'
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'))
import NotFound from './pages/NotFound.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { AuthProvider, useAuth } from './auth/AuthContext.jsx'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="container py-5">Checking session...</div>
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="container py-5">Checking session...</div>
  if (!user) return <Navigate to="/login" replace />
  return user.role === 'Admin' ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app-container d-flex flex-column min-vh-100">
        <Header />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/history" element={<PrivateRoute><History /></PrivateRoute>} />
            <Route path="/history/:id" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/admin/*" element={<AdminRoute><Suspense fallback={<div className='container py-5'>Loading admin...</div>}><AdminDashboard /></Suspense></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </AuthProvider>
  )
}
