import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-light border-top mt-auto py-3">
      <div className="container text-center">
        <p className="mb-0">&copy; {new Date().getFullYear()} Liquor Store. All rights reserved.</p>
      </div>
    </footer>
  )
}
