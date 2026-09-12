import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Dashboard from './Dashboard';
import { BrowserRouter } from 'react-router-dom';
import * as AuthContext from '@/contexts/AuthContext';
import * as AdminHook from '@/hooks/useAdmin';

// Mock dependencies
vi.mock('@/contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('@/hooks/useAdmin', () => ({
    useIsAdmin: vi.fn(),
}));

vi.mock('@/hooks/useProjects', () => ({
    useUserProjects: () => ({ data: [], isLoading: false }),
    useProjects: () => ({ data: [], isLoading: false }),
}));

// Mock child components
vi.mock('@/components/premium/LuxuryLoader', () => ({
    LuxuryLoader: () => <div data-testid="luxury-loader">Loading...</div>,
    DotsLoader: () => <div>Loading...</div>,
}));

vi.mock('@/components/layout/Layout', () => ({
    Layout: ({ children }: any) => <div data-testid="layout">{children}</div>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Dashboard Component', () => {
    const mockSignOut = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state correctly', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            user: null,
            loading: true,
            signOut: mockSignOut,
        });
        (AdminHook.useIsAdmin as any).mockReturnValue({ data: false, isLoading: false });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(screen.getByTestId('luxury-loader')).toBeInTheDocument();
    });

    it('redirects to auth when not authenticated and not loading', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            user: null,
            loading: false,
            signOut: mockSignOut,
        });
        (AdminHook.useIsAdmin as any).mockReturnValue({ data: false, isLoading: false });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/auth');
    });

    it('redirects to admin when authenticated user is admin', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            user: { id: '123', email: 'admin@example.com' },
            loading: false,
            signOut: mockSignOut,
        });
        (AdminHook.useIsAdmin as any).mockReturnValue({ data: true, isLoading: false });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/admin');
    });

    it('redirects regular non-admin users to home page', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            user: { id: '123', email: 'user@example.com' },
            loading: false,
            signOut: mockSignOut,
        });
        (AdminHook.useIsAdmin as any).mockReturnValue({ data: false, isLoading: false });

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
