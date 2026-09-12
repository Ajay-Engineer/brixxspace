import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Global Helmet mock
vi.mock('react-helmet-async', () => ({
    Helmet: ({ children }: any) => <>{children}</>,
    HelmetProvider: ({ children }: any) => <>{children}</>,
}));

// Global Lucide React Mock: safely wraps all icon components
vi.mock(import('lucide-react'), async (importOriginal) => {
    const actual = await importOriginal();
    const mocked: Record<string, any> = {};
    
    Object.keys(actual).forEach((key) => {
        if (typeof actual[key] === 'object' || typeof actual[key] === 'function') {
            const MockIcon = React.forwardRef<HTMLSpanElement, any>((props, ref) => (
                <span ref={ref} data-testid={`icon-${key.toLowerCase()}`} {...props}>
                    {key}
                </span>
            ));
            MockIcon.displayName = `LucideIcon(${key})`;
            mocked[key] = MockIcon;
        } else {
            mocked[key] = actual[key];
        }
    });

    return {
        ...mocked,
    };
});

// Global ResizeObserver mock class
class ResizeObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
}
global.ResizeObserver = ResizeObserverMock as any;

// Global IntersectionObserver mock
class IntersectionObserverMock {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn(() => []);
}
global.IntersectionObserver = IntersectionObserverMock as any;

// Global scrollTo mock
window.scrollTo = vi.fn();

// Global Framer Motion mock
const createMotionComponent = (tag: string) => {
    const Component = React.forwardRef(({ children, ...props }: any, ref: any) => {
        return React.createElement(tag, { ...props, ref }, children);
    });
    Component.displayName = `MotionComponent(${tag})`;
    return Component;
};

const motionProxy = new Proxy({}, {
    get: (target, prop: string) => {
        return createMotionComponent(prop);
    }
});

vi.mock('framer-motion', () => ({
    motion: motionProxy,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    useScroll: () => ({ scrollY: { get: () => 0, onChange: vi.fn() }, scrollYProgress: { get: () => 0 } }),
    useTransform: () => 0,
    useSpring: () => 0,
    useInView: () => true,
    useAnimation: () => ({ start: vi.fn(), set: vi.fn() }),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});
