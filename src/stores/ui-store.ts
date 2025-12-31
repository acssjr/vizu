import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ============================================================================
// Toast Types & State
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastSlice {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  // Convenience methods
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// ============================================================================
// Modal Types & State
// ============================================================================

export interface ModalConfig {
  id: string;
  type: string;
  props?: Record<string, unknown>;
}

interface ModalSlice {
  modals: ModalConfig[];
  openModal: (type: string, props?: Record<string, unknown>) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  isModalOpen: (type: string) => boolean;
}

// ============================================================================
// Sidebar/Navigation State
// ============================================================================

interface NavigationSlice {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

// ============================================================================
// Theme State (persisted)
// ============================================================================

type Theme = 'light' | 'dark' | 'system';

interface ThemeSlice {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// ============================================================================
// Combined UI Store
// ============================================================================

type UIStore = ToastSlice & ModalSlice & NavigationSlice & ThemeSlice;

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ========================================
        // Toast State & Actions
        // ========================================
        toasts: [],

        addToast: (toast) => {
          const id = generateId();
          const duration = toast.duration ?? 5000;

          set(
            (state) => ({
              toasts: [...state.toasts, { ...toast, id }],
            }),
            false,
            'toast/add'
          );

          // Auto-remove after duration
          if (duration > 0) {
            setTimeout(() => {
              get().removeToast(id);
            }, duration);
          }
        },

        removeToast: (id) => {
          set(
            (state) => ({
              toasts: state.toasts.filter((t) => t.id !== id),
            }),
            false,
            'toast/remove'
          );
        },

        clearToasts: () => {
          set({ toasts: [] }, false, 'toast/clear');
        },

        success: (message) => get().addToast({ message, type: 'success' }),
        error: (message) => get().addToast({ message, type: 'error' }),
        warning: (message) => get().addToast({ message, type: 'warning' }),
        info: (message) => get().addToast({ message, type: 'info' }),

        // ========================================
        // Modal State & Actions
        // ========================================
        modals: [],

        openModal: (type, props) => {
          const id = generateId();
          set(
            (state) => ({
              modals: [...state.modals, { id, type, props }],
            }),
            false,
            'modal/open'
          );
          return id;
        },

        closeModal: (id) => {
          set(
            (state) => ({
              modals: id
                ? state.modals.filter((m) => m.id !== id)
                : state.modals.slice(0, -1), // Remove last if no id
            }),
            false,
            'modal/close'
          );
        },

        closeAllModals: () => {
          set({ modals: [] }, false, 'modal/closeAll');
        },

        isModalOpen: (type) => {
          return get().modals.some((m) => m.type === type);
        },

        // ========================================
        // Navigation State & Actions
        // ========================================
        isSidebarOpen: true,
        isMobileMenuOpen: false,

        toggleSidebar: () => {
          set(
            (state) => ({ isSidebarOpen: !state.isSidebarOpen }),
            false,
            'nav/toggleSidebar'
          );
        },

        setSidebarOpen: (open) => {
          set({ isSidebarOpen: open }, false, 'nav/setSidebarOpen');
        },

        toggleMobileMenu: () => {
          set(
            (state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }),
            false,
            'nav/toggleMobileMenu'
          );
        },

        setMobileMenuOpen: (open) => {
          set({ isMobileMenuOpen: open }, false, 'nav/setMobileMenuOpen');
        },

        // ========================================
        // Theme State & Actions
        // ========================================
        theme: 'system',

        setTheme: (theme) => {
          set({ theme }, false, 'theme/set');
        },
      }),
      {
        name: 'vizu-ui-storage',
        // Only persist theme preference, not transient UI state
        partialize: (state) => ({
          theme: state.theme,
          isSidebarOpen: state.isSidebarOpen,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);

// ============================================================================
// Selector Hooks (for performance optimization)
// ============================================================================

export const useToasts = () => useUIStore((state) => state.toasts);
export const useAddToast = () => useUIStore((state) => state.addToast);

// Use shallow comparison to prevent infinite loops
export const useToastActions = () => {
  const addToast = useUIStore((state) => state.addToast);
  const success = useUIStore((state) => state.success);
  const error = useUIStore((state) => state.error);
  const warning = useUIStore((state) => state.warning);
  const info = useUIStore((state) => state.info);
  const removeToast = useUIStore((state) => state.removeToast);
  const clearToasts = useUIStore((state) => state.clearToasts);

  return { addToast, success, error, warning, info, removeToast, clearToasts };
};

export const useModals = () => useUIStore((state) => state.modals);
export const useModalActions = () => {
  const openModal = useUIStore((state) => state.openModal);
  const closeModal = useUIStore((state) => state.closeModal);
  const closeAllModals = useUIStore((state) => state.closeAllModals);
  const isModalOpen = useUIStore((state) => state.isModalOpen);

  return { openModal, closeModal, closeAllModals, isModalOpen };
};

export const useSidebar = () => {
  const isOpen = useUIStore((state) => state.isSidebarOpen);
  const toggle = useUIStore((state) => state.toggleSidebar);
  const setOpen = useUIStore((state) => state.setSidebarOpen);

  return { isOpen, toggle, setOpen };
};

export const useMobileMenu = () => {
  const isOpen = useUIStore((state) => state.isMobileMenuOpen);
  const toggle = useUIStore((state) => state.toggleMobileMenu);
  const setOpen = useUIStore((state) => state.setMobileMenuOpen);

  return { isOpen, toggle, setOpen };
};

export const useTheme = () => {
  const theme = useUIStore((state) => state.theme);
  const setTheme = useUIStore((state) => state.setTheme);

  return { theme, setTheme };
};
