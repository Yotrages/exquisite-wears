import React from 'react'
import { render, screen } from '@testing-library/react'
import Hello from '../Hello'

describe('Hello Component', () => {
    test('renders the correct message', () => { 
        render(<Hello />)
        expect(screen.getByText('Hello World')).toBeInTheDocument()
     })
})