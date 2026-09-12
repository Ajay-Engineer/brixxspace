import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminBlogs from './AdminBlogs';
import { BrowserRouter } from 'react-router-dom';

// Dependency Mocks
vi.mock('@tanstack/react-query', () => ({
    useQuery: vi.fn(),
    useMutation: vi.fn(),
    useQueryClient: vi.fn(() => ({
        invalidateQueries: vi.fn(),
    })),
}));

vi.mock('@/contexts/AuthContext', () => ({
    useAuth: () => ({ user: { id: 'admin-user' }, loading: false }),
}));

const mockMutateAsync = vi.fn().mockResolvedValue({});
const mockDeleteMutate = vi.fn();

vi.mock('@/hooks/useAdmin', () => ({
    useIsAdmin: () => ({ data: true, isLoading: false }),
}));

vi.mock('@/hooks/useBlogs', () => ({
    useBlogs: () => ({
        data: [
            {
                id: '1',
                title: 'First Blog Post',
                slug: 'first-blog-post',
                excerpt: 'An interesting read',
                content: 'Full content here',
                author: 'Admin',
                date: '2023-01-01',
                category: 'Tech',
                featured: true,
            },
        ],
        isLoading: false,
    }),
    useCreateBlog: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
    useUpdateBlog: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
    useDeleteBlog: () => ({ mutate: mockDeleteMutate, isPending: false }),
}));

vi.mock('@/components/admin/AdminLayout', () => ({
    AdminLayout: ({ children }: any) => <div data-testid="admin-layout">{children}</div>,
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('AdminBlogs', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders blogs list', () => {
        render(
            <BrowserRouter>
                <AdminBlogs />
            </BrowserRouter>
        );

        expect(screen.getByText('First Blog Post')).toBeInTheDocument();
        expect(screen.getByText('Tech')).toBeInTheDocument();
        expect(screen.getByText('Featured')).toBeInTheDocument();
    });

    it('allows adding a new blog post', async () => {
        render(
            <BrowserRouter>
                <AdminBlogs />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('add-blog-btn'));

        const formInputs = document.querySelectorAll('form input, form textarea');
        if (formInputs.length >= 2) {
            fireEvent.change(formInputs[0], { target: { value: 'New Blog' } });
            fireEvent.change(formInputs[2], { target: { value: 'New Excerpt' } });
        }

        const createBtns = screen.getAllByRole('button', { name: /^Create$/i });
        fireEvent.click(createBtns[createBtns.length - 1]);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled();
        });
    });

    it('allows editing a blog post', async () => {
        render(
            <BrowserRouter>
                <AdminBlogs />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('edit-blog-1'));

        const titleInput = screen.getByDisplayValue('First Blog Post');
        fireEvent.change(titleInput, { target: { value: 'Updated Blog' } });

        const updateBtns = screen.getAllByRole('button', { name: /^Update$/i });
        fireEvent.click(updateBtns[updateBtns.length - 1]);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                id: '1',
                title: 'Updated Blog',
            }));
        });
    });

    it('allows deleting a blog post', async () => {
        render(
            <BrowserRouter>
                <AdminBlogs />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('delete-blog-1'));

        const confirmBtn = await screen.findByTestId('confirm-delete-btn');
        fireEvent.click(confirmBtn);

        expect(mockDeleteMutate).toHaveBeenCalledWith('1');
    });
});
