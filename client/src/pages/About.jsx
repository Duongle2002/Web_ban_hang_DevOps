import React from 'react'

export default function About() {
  return (
    <div>
      <section className="hero" style={{backgroundImage: "url(/images/bg_2.jpg)", backgroundSize:'cover'}}>
        <div className="overlay" />
        <div className="container py-5">
          <div className="text-center text-white" style={{minHeight:'200px', display:'flex', alignItems:'end', justifyContent:'center'}}>
            <div>
              <p className="mb-1"><a className="text-white" href="/">Home</a> / About us</p>
              <h2>About Us</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-md-6">
              <div className="ratio ratio-16x9 rounded" style={{backgroundImage:'url(/images/about.jpg)', backgroundSize:'cover', backgroundPosition:'center', minHeight:300}} />
            </div>
            <div className="col-md-6">
              <span className="text-muted">Since 1905</span>
              <h2 className="mb-3">Desire meets a new Taste</h2>
              <p>A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country.</p>
              <p>On her way she met a copy. The copy warned the Little Blind Text...</p>
              <p className="h4"><strong>115</strong> Years of Experience In Business</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
