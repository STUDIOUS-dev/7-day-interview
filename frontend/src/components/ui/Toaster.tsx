import { Toaster as HotToaster } from 'react-hot-toast';
import { theme } from '@/styles/theme';

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: theme.colors.bgElevated,
          color: theme.colors.textPrimary,
          border: `1px solid ${theme.colors.borderSubtle}`,
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(30,52,52,1)',
        },
        success: {
          iconTheme: {
            primary: theme.colors.success,
            secondary: theme.colors.bgElevated,
          },
        },
        error: {
          iconTheme: {
            primary: theme.colors.danger,
            secondary: theme.colors.bgElevated,
          },
        },
      }}
    />
  );
}
