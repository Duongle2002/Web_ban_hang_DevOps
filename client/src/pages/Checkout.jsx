import React, { useEffect, useState } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import { useCurrency } from '../main.jsx'

export default function Checkout() {
  const [cart, setCart] = useState(null)
  const [form, setForm] = useState({ firstname:'', lastname:'', phone:'', email:'', streetaddress:'', apartment:'', towncity:'', country:'Vietnam', payment:'bank', agree:false })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [qrUrl, setQrUrl] = useState(null)
  const navigate = useNavigate()
  const { currency, format, rate } = useCurrency()

  // Bank info via environment variables (fallback to placeholders if missing)
  const bank = {
    code: import.meta.env.VITE_BANK_CODE || 'mb',
    accountNumber: import.meta.env.VITE_BANK_ACCOUNT || '123456789',
    accountName: import.meta.env.VITE_BANK_NAME || 'NGUYEN VAN A',
    template: import.meta.env.VITE_VIETQR_TEMPLATE || 'compact2',
    addInfo: import.meta.env.VITE_VIETQR_ADDINFO || 'Thanh toan don hang'
  }

  useEffect(() => {
    api.get('/cart')
      .then(res => setCart(res.data?.cart || { items: [], subtotal: 0 }))
      .catch(() => setCart({ items: [], subtotal: 0 }))
  }, [])

  // Generate QR when choosing Direct Bank Transfer
  useEffect(() => {
    if (form.payment !== 'bank') { setQrUrl(null); return }
    const subtotalUSD = cart?.subtotal || 0
    // Prefer VietQR image URL. Fallback to local QR if missing config.
    if (bank.code && bank.accountNumber) {
      const params = new URLSearchParams()
      if (bank.accountName) params.set('accountName', bank.accountName)
      if (subtotalUSD) params.set('amount', Math.round(Number(subtotalUSD) * rate))
      if (bank.addInfo) params.set('addInfo', bank.addInfo)
      const vietQrUrl = `https://img.vietqr.io/image/${bank.code}-${bank.accountNumber}-${bank.template}.png?${params.toString()}`
      setQrUrl(vietQrUrl)
      return
    }
    const amount = (subtotalUSD || 0).toFixed(2)
    const payload = `BANK:${bank.code}\nACC:${bank.accountNumber}\nNAME:${bank.accountName}\nAMOUNT:${amount}\nINFO:${bank.addInfo}`
    QRCode.toDataURL(payload, { width: 240 })
      .then(url => setQrUrl(url))
      .catch(() => setQrUrl(null))
  }, [form.payment, cart?.subtotal, rate, bank.code, bank.accountNumber, bank.accountName, bank.addInfo, bank.template])

  function update(key) {
    return e => setForm(p => ({ ...p, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  }

  async function placeOrder() {
    setStatus(null)
    const required = ['firstname','lastname','phone','email','streetaddress','towncity','payment']
    for (const k of required) { if (!form[k]) { setStatus({type:'error', message:'Please fill in all required fields'}); return } }
    if (!form.agree) { setStatus({type:'error', message:'Please accept terms and conditions'}) ; return }
    setLoading(true)
    try {
      const body = { ...form }
      delete body.agree
      await api.post('/checkout', body)
      setStatus({ type:'success', message:'Order placed successfully!' })
      setTimeout(() => navigate('/history'), 1000)
    } catch (e) {
      setStatus({ type:'error', message: e.response?.data?.message || e.message })
    } finally {
      setLoading(false)
    }
  }

  const items = cart?.items || []
  const subtotalUSD = cart?.subtotal || 0
  const subtotalDisplay = currency === 'USD' ? `$${subtotalUSD.toFixed(2)}` : (Math.round(subtotalUSD * rate)).toLocaleString('vi-VN') + '₫'

  return (
    <div>
      <section className="hero" style={{backgroundImage: "url(/images/bg_2.jpg)", backgroundSize:'cover'}}>
        <div className="overlay" />
        <div className="container py-5">
          <div className="text-center text-white" style={{minHeight:'200px', display:'flex', alignItems:'end', justifyContent:'center'}}>
            <div>
              <p className="mb-1"><a className="text-white" href="/">Home</a> / Checkout</p>
              <h2>Checkout</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-4 bg-light rounded">
                <h3 className="mb-3">Billing Details</h3>
                {status && <div className={`alert ${status.type==='success'?'alert-success':'alert-danger'}`}>{status.message}</div>}
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <input className="form-control" value={form.firstname} onChange={update('firstname')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <input className="form-control" value={form.lastname} onChange={update('lastname')} />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">Country</label>
                    <select className="form-select" value={form.country} onChange={update('country')}>
                      <option>Vietnam</option>
                      <option>Japan</option>
                      <option>Italy</option>
                      <option>France</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Street Address</label>
                    <input className="form-control" value={form.streetaddress} onChange={update('streetaddress')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Apartment</label>
                    <input className="form-control" value={form.apartment} onChange={update('apartment')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Town/City</label>
                    <input className="form-control" value={form.towncity} onChange={update('towncity')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <input className="form-control" value={form.phone} onChange={update('phone')} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={form.email} onChange={update('email')} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3 className="mb-3">Cart Total</h3>
                {items.length > 0 && (
                  <div className="mb-3">
                    {items.map(it => (
                      <div key={it.productId?._id} className="d-flex justify-content-between small text-muted">
                        <span>{it.productId?.name} x {it.quantity}</span>
                        <span>{format(Number(it.productId?.price || 0) * Number(it.quantity || 0))}</span>
                      </div>
                    ))}
                    <hr/>
                  </div>
                )}
                <div className="d-flex justify-content-between"><span>Subtotal</span><span>{subtotalDisplay}</span></div>
                <div className="d-flex justify-content-between"><span>Delivery</span><span>$0.00</span></div>
                <div className="d-flex justify-content-between"><span>Discount</span><span>$0.00</span></div>
                <hr/>
                <div className="d-flex justify-content-between fw-bold"><span>Total</span><span>{subtotalDisplay}</span></div>
                <h5 className="mt-4">Payment Method</h5>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="payment" id="pay1" value="bank" checked={form.payment==='bank'} onChange={update('payment')} />
                  <label className="form-check-label" htmlFor="pay1">Direct Bank Transfer</label>
                </div>
                {form.payment === 'bank' && (
                  <div className="mt-3 p-3 border rounded bg-light">
                    <h6 className="mb-2">Quét mã QR để chuyển khoản</h6>
                    {qrUrl ? (
                      <img src={qrUrl} alt="QR Bank Transfer" width={240} height={240} />
                    ) : (
                      <small>Đang tạo mã QR...</small>
                    )}
                    <div className="mt-2 small text-muted">
                      <div>Mã ngân hàng: {bank.code}</div>
                      <div>Số tài khoản: {bank.accountNumber}</div>
                      <div>Chủ tài khoản: {bank.accountName}</div>
                      <div>Số tiền: {subtotalDisplay}</div>
                      <div>Thông tin: {bank.addInfo}</div>
                    </div>
                  </div>
                )}
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="payment" id="pay2" value="check" checked={form.payment==='check'} onChange={update('payment')} />
                  <label className="form-check-label" htmlFor="pay2">Check Payment</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="payment" id="pay3" value="paypal" checked={form.payment==='paypal'} onChange={update('payment')} />
                  <label className="form-check-label" htmlFor="pay3">Paypal</label>
                </div>
                <div className="form-check mt-3">
                  <input className="form-check-input" type="checkbox" id="agree" checked={form.agree} onChange={update('agree')} />
                  <label className="form-check-label" htmlFor="agree">I have read and accept the terms and conditions</label>
                </div>
                <button className="btn btn-primary mt-3" onClick={placeOrder} disabled={loading}>{loading? 'Placing order...' : 'Place an order'}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
