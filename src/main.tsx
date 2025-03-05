
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './contexts/auth/AuthProvider'
import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'

// Create a client for React Query
const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </BrowserRouter>
);
