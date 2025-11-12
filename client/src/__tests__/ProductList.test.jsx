import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductList from '../pages/ProductList.jsx'
import * as apiModule from '../services/api.js'
import { describe, it, expect, vi } from 'vitest'

describe('ProductList', () => {
  it('renders products from API', async () => {
    vi.spyOn(apiModule.api, 'get').mockResolvedValueOnce({
      data: {
        products: [
          { _id: '1', name: 'Test Product A', price: 10, category: 'Cat', image: 'imgA' },
          { _id: '2', name: 'Test Product B', price: 20, category: 'Cat', image: 'imgB' }
        ],
        total: 2
      }
    })

    render(<MemoryRouter><ProductList /></MemoryRouter>)
    expect(screen.getByText(/Loading/i)).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByText('Test Product A')).toBeInTheDocument()
      expect(screen.getByText('Test Product B')).toBeInTheDocument()
    })
  })
})
