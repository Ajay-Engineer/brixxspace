import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';

vi.mock('@/lib/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
    },
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Test consumer component
const TestConsumer = () => {
    const { user, loading, signIn, signOut } = useAuth();

    return (
        <div>
            <div data-testid="auth-loading">{loading ? 'loading' : 'idle'}</div>
            <div data-testid="auth-user">{user ? user.email : 'guest'}</div>
            <button
                data-testid="login-btn"
                onClick={() => signIn('user@brixxspace.com', 'secret123')}
            >
                Login
            </button>
            <button data-testid="logout-btn" onClick={() => signOut()}>
                Logout
            </button>
        </div>
    );
};

describe('AuthContext / AuthProvider', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('initializes and checks auth status on mount', async () => {
        (api.get as any).mockResolvedValueOnce({
            data: {
                _id: 'user-999',
                email: 'authenticated@brixxspace.com',
                fullName: 'Alice Bob',
                role: 'client',
            },
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(await screen.findByText('authenticated@brixxspace.com')).toBeInTheDocument();
        expect(screen.getByTestId('auth-loading')).toHaveTextContent('idle');
    });

    it('handles sign in flow successfully', async () => {
        (api.get as any).mockRejectedValueOnce(new Error('Unauthorized'));
        (api.post as any).mockResolvedValueOnce({
            data: {
                _id: 'user-100',
                email: 'user@brixxspace.com',
                fullName: 'Logged In User',
                role: 'user',
            },
        });

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        // Initially guest
        expect(await screen.findByText('guest')).toBeInTheDocument();

        // Perform Sign In
        await act(async () => {
            screen.getByTestId('login-btn').click();
        });

        expect(await screen.findByText('user@brixxspace.com')).toBeInTheDocument();
    });

    it('handles sign out flow properly', async () => {
        (api.get as any).mockResolvedValueOnce({
            data: {
                _id: 'user-100',
                email: 'user@brixxspace.com',
                fullName: 'Logged In User',
                role: 'user',
            },
        });
        (api.post as any).mockResolvedValueOnce({});

        render(
            <AuthProvider>
                <TestConsumer />
            </AuthProvider>
        );

        expect(await screen.findByText('user@brixxspace.com')).toBeInTheDocument();

        await act(async () => {
            screen.getByTestId('logout-btn').click();
        });

        expect(await screen.findByText('guest')).toBeInTheDocument();
    });
});
