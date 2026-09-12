import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminServices from './AdminServices';
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

vi.mock('@/hooks/useAdmin', () => ({
    useIsAdmin: () => ({ data: true, isLoading: false }),
}));

const mockMutateAsync = vi.fn().mockResolvedValue({});
const mockDeleteMutate = vi.fn();

vi.mock('@/hooks/useServices', () => ({
    useServices: () => ({
        data: [
            { id: '1', title: 'Service A', description: 'Desc A', icon: 'Building2', features: ['Feat 1'] }
        ],
        isLoading: false
    }),
    useCreateService: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
    useUpdateService: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
    useDeleteService: () => ({ mutate: mockDeleteMutate, isPending: false }),
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

describe('AdminServices', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders services list', () => {
        render(
            <BrowserRouter>
                <AdminServices />
            </BrowserRouter>
        );
        expect(screen.getByText('Service A')).toBeInTheDocument();
        expect(screen.getByText('Feat 1')).toBeInTheDocument();
    });

    it('allows adding a new service', async () => {
        render(
            <BrowserRouter>
                <AdminServices />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('add-service-btn'));

        const titleInput = document.querySelector('#title') as HTMLInputElement;
        const descInput = document.querySelector('#description') as HTMLTextAreaElement;

        if (titleInput) fireEvent.change(titleInput, { target: { value: 'New Service' } });
        if (descInput) fireEvent.change(descInput, { target: { value: 'New Description' } });

        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Service',
                description: 'New Description',
            }));
        });
    });

    it('allows editing a service', async () => {
        render(
            <BrowserRouter>
                <AdminServices />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('edit-service-1'));

        const titleInput = screen.getByDisplayValue('Service A');
        fireEvent.change(titleInput, { target: { value: 'Updated Service' } });

        fireEvent.click(screen.getByText('Update'));

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                id: '1',
                title: 'Updated Service',
            }));
        });
    });

    it('allows deleting a service', async () => {
        render(
            <BrowserRouter>
                <AdminServices />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('delete-service-1'));

        const confirmBtn = await screen.findByTestId('confirm-delete-btn');
        fireEvent.click(confirmBtn);

        expect(mockDeleteMutate).toHaveBeenCalledWith('1');
    });
});
