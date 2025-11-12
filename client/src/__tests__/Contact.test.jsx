import { render, screen, fireEvent } from '@testing-library/react'
import Contact from '../pages/Contact.jsx'
import { describe, it, expect } from 'vitest'

describe('Contact', () => {
  it('shows validation error when submitting empty form', () => {
    render(<Contact />)
    const button = screen.getByRole('button', { name: /send message/i })
    fireEvent.click(button)
    expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument()
  })
})
