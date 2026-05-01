import { Provider } from "@/components/ui/provider"
// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from './context/AuthContext.tsx'; 
import { GlobalStateProvider } from './context/GlobalContext.tsx'; 
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import AppRoutes from './routes/AppRoutes';
import { ApolloProvider } from "@apollo/client/react";
import { client } from "./utils/ApolloClient.ts";
import AuthLoader from "./custom/components/Loaders/AuthLoader.tsx";

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Router>
      <ApolloProvider client={client}>
        <GlobalStateProvider>
          <AuthProvider>
            <Provider>
              <AuthLoader>
                <AppRoutes />
              </AuthLoader>
            </Provider>
          </AuthProvider>
        </GlobalStateProvider>
      </ApolloProvider>
    </Router>
  // </StrictMode>,
)
