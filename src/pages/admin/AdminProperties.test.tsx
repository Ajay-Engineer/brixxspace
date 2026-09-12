import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminProperties from './AdminProperties';
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

vi.mock('@/hooks/useProperties', () => ({
    useProperties: () => ({
        data: [
            {
                id: '1',
                title: 'Luxury Villa',
                location: 'Beverly Hills',
                property_type: 'Villa',
                status: 'available',
                price: 5000000,
                area_sqft: 4000,
                bedrooms: 5,
                bathrooms: 4,
                description: 'A beautiful villa',
                amenities: ['Pool', 'Garden'],
            },
        ],
        isLoading: false,
    }),
    useCreateProperty: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
    useUpdateProperty: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
    useDeleteProperty: () => ({ mutate: mockDeleteMutate, isPending: false }),
    formatPrice: (price: number) => price.toLocaleString('en-IN'),
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

describe('AdminProperties', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders properties list', () => {
        render(
            <BrowserRouter>
                <AdminProperties />
            </BrowserRouter>
        );

        expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
        expect(screen.getByText('Beverly Hills')).toBeInTheDocument();
    });

    it('allows adding a new property', async () => {
        render(
            <BrowserRouter>
                <AdminProperties />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('add-property-btn'));

        const titleInput = document.querySelector('#title') as HTMLInputElement;
        const locationInput = document.querySelector('#location') as HTMLInputElement;
        const priceInput = document.querySelector('#price') as HTMLInputElement;

        if (titleInput) fireEvent.change(titleInput, { target: { value: 'New Apartment' } });
        if (locationInput) fireEvent.change(locationInput, { target: { value: 'Downtown' } });
        if (priceInput) fireEvent.change(priceInput, { target: { value: '2000000' } });

        fireEvent.click(screen.getByText('Create'));

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                title: 'New Apartment',
                location: 'Downtown',
                price: 2000000,
            }));
        });
    });

    it('allows editing a property', async () => {
        render(
            <BrowserRouter>
                <AdminProperties />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('edit-property-1'));

        const titleInput = screen.getByDisplayValue('Luxury Villa');
        fireEvent.change(titleInput, { target: { value: 'Updated Villa' } });

        fireEvent.click(screen.getByText('Update'));

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
                id: '1',
                title: 'Updated Villa',
            }));
        });
    });

    it('allows deleting a property', async () => {
        render(
            <BrowserRouter>
                <AdminProperties />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByTestId('delete-property-1'));

        const confirmBtn = await screen.findByTestId('confirm-delete-btn');
        fireEvent.click(confirmBtn);

        expect(mockDeleteMutate).toHaveBeenCalledWith('1');
    });
});
