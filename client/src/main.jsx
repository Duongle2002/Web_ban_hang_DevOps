import React, { createContext, useContext, useState, useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

// Currency context to toggle USD/VND and apply exchange rate
const CurrencyContext = createContext(null)
export function useCurrency() { return useContext(CurrencyContext) }

function CurrencyProvider({ children }) {
  const defaultCurrency = (typeof window !== 'undefined' && localStorage.getItem('currency')) || 'USD'
  const [currency, setCurrency] = useState(defaultCurrency)
  const rate = Number(import.meta.env.VITE_EXCHANGE_RATE_VND_PER_USD || 25000) // fallback rate
  const toggle = (cur) => {
    setCurrency(cur)
    if (typeof window !== 'undefined') localStorage.setItem('currency', cur)
  }
  const format = (usdAmount) => {
    if (currency === 'USD') return `$${usdAmount}`
    const vnd = Math.round(Number(usdAmount) * rate)
    return vnd.toLocaleString('vi-VN') + '₫'
  }
  const value = useMemo(() => ({ currency, setCurrency: toggle, format, rate }), [currency, rate])
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CurrencyProvider>
        <App />
      </CurrencyProvider>
    </BrowserRouter>
  </React.StrictMode>
)
