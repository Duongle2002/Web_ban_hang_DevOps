import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="hero" style={{backgroundImage: "url(/images/bg_2.jpg)", backgroundSize:'cover'}}>
        <div className="overlay" />
        <div className="container">
          <div className="row no-gutters align-items-center justify-content-center" style={{minHeight:'380px'}}>
            <div className="col-md-8 d-flex align-items-end">
              <div className="text w-100 text-center">
                <h1 className="mb-4">Good <span>Drink</span> for Good <span>Moments</span>.</h1>
                <p>
                  <Link to="/product" className="btn btn-primary py-2 px-4">Shop Now</Link>{' '}
                  <Link to="/about" className="btn btn-outline-secondary py-2 px-4">Read more</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ftco-intro container py-5">
        <div className="row">
          {[{icon:'support',title:'Online Support 24/7'},{icon:'cashback',title:'Money Back Guarantee'},{icon:'free-delivery',title:'Free Shipping & Return'}].map(item => (
            <div className="col-md-4" key={item.icon}>
              <div className="intro p-3 h-100 bg-light">
                <div className="icon mb-2"><span className={`flaticon-${item.icon}`}></span></div>
                <h2>{item.title}</h2>
                <p>A small river named Duden flows by their place and supplies it with the necessary regelialia.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="container py-5 text-center">
        <Link to="/product" className="btn btn-primary">View All Products →</Link>
      </div>
    </>
  )
}
