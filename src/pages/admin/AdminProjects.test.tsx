import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminProjects from './AdminProjects';
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

vi.mock('@/hooks/useProjects', () => ({
    useProjects: () => ({
        data: [
            {
                id: '1',
                title: 'Project Alpha',
                description: 'A test project',
                location: 'Test City',
                category: 'Residential',
                status: 'ongoing',
                progress: 50,
            },
        ],
        isLoading: false,
    }),
    useCreateProject: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
    useUpdateProject: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
    useDeleteProject: () => ({ mutate: mockDeleteMutate, isPending: false }),
}));

vi.mock('@/hooks/useProjectCategories', () => ({
    useProjectCategories: () => ({ data: [{ _id: 'cat-1', title: 'Residential' }], isLoading: false }),
}));

vi.mock('@/hooks/useProjectSubcategories', () => ({
    useProjectSubcategories: () => ({ data: [], isLoading: false }),
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

describe('AdminProjects', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders projects list', () => {
        render(
            <BrowserRouter>
                <AdminProjects />
            </BrowserRouter>
        );

        expect(screen.getByText('Project Alpha')).toBeInTheDocument();
        expect(screen.getByText('Test City')).toBeInTheDocument();
    });

    it('allows adding a new project', async () => {
        const { container } = render(
            <BrowserRouter>
                <AdminProjects />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByText(/Add Project/i));

        const inputs = Array.from(container.querySelectorAll('input, textarea')) as HTMLInputElement[];
        // Title input is the first input inside the form
        const formInputs = document.querySelectorAll('form input');
        if (formInputs.length >= 2) {
            fireEvent.change(formInputs[0], { target: { value: 'New Project' } });
            fireEvent.change(formInputs[1], { target: { value: 'New Location' } });
        }

        fireEvent.click(screen.getByText('Create Project'));

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Project',
                location: 'New Location',
            }));
        });
    });

    it('allows editing a project', async () => {
        render(
            <BrowserRouter>
                <AdminProjects />
            </BrowserRouter>
        );

        const editButtons = screen.getAllByRole('button');
        const editBtn = editButtons.find(b => b.querySelector('[data-testid="icon-pencil"]'));
        if (editBtn) fireEvent.click(editBtn);

        const titleInput = screen.getByDisplayValue('Project Alpha');
        fireEvent.change(titleInput, { target: { value: 'Updated Project' } });

        fireEvent.click(screen.getByText('Update Project'));

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                id: '1',
                title: 'Updated Project',
            }));
        });
    });

    it('allows deleting a project', async () => {
        render(
            <BrowserRouter>
                <AdminProjects />
            </BrowserRouter>
        );

        const deleteButtons = screen.getAllByRole('button');
        const trashBtn = deleteButtons.find(b => b.querySelector('[data-testid="icon-trash2"]'));
        if (trashBtn) fireEvent.click(trashBtn);

        const confirmBtn = await screen.findByRole('button', { name: /^Delete$/i });
        fireEvent.click(confirmBtn);

        expect(mockDeleteMutate).toHaveBeenCalledWith('1');
    });
});
