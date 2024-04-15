import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import Page from '../app/chart-bot/page'
describe('Home component', () => {
  it('renders correctly', () => {
    render(<Page />)
    expect(
      screen.getByText(/Wealth Management Assistants/i),
    ).toBeInTheDocument()
  })
})
