import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Navbar } from '@/components/layout/Navbar';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '@/contexts/AuthContext';

vi.mock('@/contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}));

describe('Navbar Component', () => {
    const mockSignOut = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders header with logo and menu button', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            user: null,
            signOut: mockSignOut,
        });

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        expect(screen.getByAltText('Brixx Space')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
        expect(screen.getByRole('link', { name: /contact us/i })).toBeInTheDocument();
    });

    it('opens navigation drawer and reveals links when menu is clicked', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            user: null,
            signOut: mockSignOut,
        });

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        const menuBtn = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(menuBtn);

        expect(screen.getAllByText('About').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Services').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Projects').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Blog').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Client Login').length).toBeGreaterThan(0);
    });

    it('displays client profile and sign out links when authenticated', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            user: {
                id: 'usr-1',
                email: 'test@brixxspace.com',
                fullName: 'John Doe',
                role: 'user',
            },
            signOut: mockSignOut,
        });

        render(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>
        );

        const menuBtn = screen.getByRole('button', { name: /open menu/i });
        fireEvent.click(menuBtn);

        expect(screen.getAllByText('Profile').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Interests').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Sign Out').length).toBeGreaterThan(0);
    });
});
