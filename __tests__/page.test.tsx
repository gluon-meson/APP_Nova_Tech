import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Page from '../app/page'
describe('Home component', () => {
  it('renders correctly', () => {
    render(<Page />)
    expect(screen.getByText(/home/i)).toBeInTheDocument()
  })
})
