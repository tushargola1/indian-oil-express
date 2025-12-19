  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import App from './App.jsx'
  import { QueryClient ,QueryClientProvider  } from '@tanstack/react-query'
  import '@syncfusion/ej2-base/styles/material.css';
  import '@syncfusion/ej2-react-calendars/styles/material.css';

    const queryClient = new QueryClient()
  createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
      <App />
   </QueryClientProvider>
  )
