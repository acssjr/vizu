import '@testing-library/jest-dom/vitest'
import { vi, beforeAll, afterAll, afterEach } from 'vitest'

// ============================================
// Next.js Navigation Mocks
// ============================================
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
  useParams: () => ({}),
  redirect: vi.fn(),
  notFound: vi.fn(),
}))

// ============================================
// Next/Image Mock
// ============================================
vi.mock('next/image', () => ({
  default: vi.fn().mockImplementation((props) => {
    return props
  }),
}))

// ============================================
// Intersection Observer Mock (for lazy loading)
// ============================================
class MockIntersectionObserver {
  readonly root: Element | null = null
  readonly rootMargin: string = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor() {
    this.root = null
    this.rootMargin = ''
    this.thresholds = []
  }

  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn().mockReturnValue([])
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

// ============================================
// ResizeObserver Mock
// ============================================
class MockResizeObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver

// ============================================
// matchMedia Mock
// ============================================
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// ============================================
// localStorage Mock
// ============================================
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// ============================================
// scrollTo Mock
// ============================================
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
})

// ============================================
// Crypto Mock (for UUID generation)
// ============================================
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
    getRandomValues: (arr: Uint8Array) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
  },
})

// ============================================
// Fetch Mock (basic - override in individual tests)
// ============================================
global.fetch = vi.fn()

// ============================================
// Console Suppression (optional - uncomment to suppress)
// ============================================
// beforeAll(() => {
//   vi.spyOn(console, 'error').mockImplementation(() => {})
//   vi.spyOn(console, 'warn').mockImplementation(() => {})
// })

// ============================================
// Cleanup after each test
// ============================================
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.getItem.mockReset()
  localStorageMock.setItem.mockReset()
})

// ============================================
// Global test utilities
// ============================================
beforeAll(() => {
  // Any global setup
})

afterAll(() => {
  // Any global teardown
})
