import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ApolloProvider } from '@apollo/client'
import '../styles/index.css'
import App from '../App.tsx'
import { apolloClient } from '@/services/api/apollo.ts'

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={apolloClient}>
    <StrictMode>
      <App />
    </StrictMode>,
  </ApolloProvider>
)
