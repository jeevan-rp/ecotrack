import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from './Navigation';
import { useAuth } from '../context/AuthContext';

// Mock the AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('Navigation Component', () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({
      user: { name: 'Test User', pfp: null },
      logout: mockLogout,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <Navigation />
      </BrowserRouter>
    );

  it('renders the EcoTrack logo text', () => {
    renderComponent();
    expect(screen.getByText('EcoTrack')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    renderComponent();
    expect(screen.getByRole('link', { name: /Go to Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Log new activity/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Insights/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View Profile/i })).toBeInTheDocument();
  });

  it('calls logout when the logout button is clicked', () => {
    renderComponent();
    const logoutBtn = screen.getByRole('button', { name: /Logout of application/i });
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
