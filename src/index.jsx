import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import { CookiesProvider } from 'react-cookie';
import { UserProvider } from './contexts/UserContext';
import { SearchProvider } from './contexts/SearchContext';
import { CartProvider } from './contexts/CartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="88738818633-aqae77l73egs6d3sbc2fg13rvcoiuhrl.apps.googleusercontent.com">
      <BrowserRouter>
        <ChakraProvider>
          <UserProvider>
            <SearchProvider>
              <CartProvider>
                <CookiesProvider>
                  <App/>
                </CookiesProvider>
              </CartProvider>
            </SearchProvider>
          </UserProvider>
        </ChakraProvider>
      </BrowserRouter>
  </GoogleOAuthProvider>
);