import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { useTestimonials } from '@/hooks/useTestimonials';

// Mock the hook that fetches testimonials
vi.mock('@/hooks/useTestimonials', () => ({
    useTestimonials: vi.fn(),
}));

describe('Integration: Admin to User Data Flow', () => {
    it('displays testimonials added via admin (mocked) in the user section', async () => {
        // 1. Simulate data "stored" in the backend (mocked response)
        const mockAdminAddedData = [
            {
                id: '123',
                name: 'Integration Client',
                content: 'This data comes from the admin side.',
                rating: 5,
                featured: true,
                role: 'CEO, Test Corp',
                created_at: new Date().toISOString(),
            },
        ];

        // 2. Mock the user-side hook to return this "stored" data
        (useTestimonials as any).mockReturnValue({
            data: mockAdminAddedData,
            isLoading: false,
        });

        // 3. Render the User-facing component
        render(<TestimonialsSection />);

        // 4. Verify the data appears
        expect(screen.getByText('Integration Client')).toBeInTheDocument();
        expect(screen.getByText(/"This data comes from the admin side."/)).toBeInTheDocument();
        expect(screen.getByText('CEO, Test Corp')).toBeInTheDocument();
    });
});
