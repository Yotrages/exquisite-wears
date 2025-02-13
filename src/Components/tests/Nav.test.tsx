import React from "react";
import  { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter as Router } from "react-router-dom";
import Nav from "../Nav";

describe('Navbar', () => {
    const setUp = () => render(
        <Router>
            <Nav change={false} setChange={() => console.log('logged')}/>
        </Router>
    );

    test('renders the navbar', () => {
        setUp();
        expect(screen.getByText('Exquisite')).toBeInTheDocument();
    });

    // test('renders the link', () => {
    //   setUp();
    //   const toggle = screen.getAllByAltText('menu')
    //   fireEvent.click(toggle)
    //   expect(screen.getByText('About')).toBeVisible
    //   expect(screen.getByText('Login')).toBeVisible
    //   expect(screen.getByText('Register')).toBeVisible
    //   expect(screen.getByText('Home')).toBeVisible

    //   fireEvent.click(toggle);
    //   expect(screen.getByText('About')).not.toBeVisible
    //   expect(screen.getByText('Login')).not.toBeVisible
    //   expect(screen.getByText('Register')).not.toBeVisible
    //   expect(screen.getByText('Home')).not.toBeVisible
    // })
})