import React, { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const showMap = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE !== 'test'

  function update(key) {
    return e => setForm(prev => ({ ...prev, [key]: e.target.value }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setStatus(null)
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus({ type: 'error', message: 'Please fill in all fields' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/contact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setStatus({ type: 'success', message: 'Thank you for contacting our shop. We will get back to you soon!' })
        setForm({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus({ type: 'error', message: data.message || 'Something went wrong. Please try again.' })
      }
    } catch (e) {
      setStatus({ type: 'error', message: e.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <section className="hero" style={{backgroundImage: "url(/images/bg_2.jpg)", backgroundSize:'cover'}}>
        <div className="overlay" />
        <div className="container py-5">
          <div className="text-center text-white" style={{minHeight:'200px', display:'flex', alignItems:'end', justifyContent:'center'}}>
            <div>
              <p className="mb-1"><a className="text-white" href="/">Home</a> / Contact</p>
              <h2>Contact Us</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 bg-light">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-7">
              <div className="p-4 bg-white rounded shadow-sm">
                <h3 className="mb-4">Contact Us</h3>
                {status && (
                  <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>{status.message}</div>
                )}
                <form onSubmit={onSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input className="form-control" value={form.name} onChange={update('name')} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-control" value={form.email} onChange={update('email')} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Subject</label>
                      <input className="form-control" value={form.subject} onChange={update('subject')} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Message</label>
                      <textarea rows="4" className="form-control" value={form.message} onChange={update('message')} />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-md-5">
              <div className="h-100">
                {showMap ? (
                  <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.150199719023!2d-77.039110088463!3d38.89768044656946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7b7bcdecbb1df%3A0x715969d86d0b76bf!2zTmjDoCBUcuG6r25n!5e0!3m2!1svi!2s!4v1734202163354!5m2!1svi!2s" width="100%" height="555" style={{border:0}} allowFullScreen loading="lazy"></iframe>
                ) : (
                  <div className="d-flex align-items-center justify-content-center bg-light border rounded" style={{height:'555px'}}>
                    <span className="text-muted">Map preview disabled in tests</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
