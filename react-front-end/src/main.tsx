import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Orders from './pages/Orders.tsx'
import ContactsPage from './pages/ContactsPage.tsx'
import Messages from './pages/Messages.tsx'
import SignInPage from './pages/SignInPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import IndexPage from './pages/IndexPage.tsx'
import ProductsPage from './pages/ProductsPage.tsx'
import AddOrUpdateContactPage from './pages/AddOrUpdateContactPage.tsx'
import AddOrUpdateProductPage from './pages/AddOrUpdateProductPage.tsx'
import CartPage from './pages/CartPage.tsx'
import CheckoutPage from './pages/CheckoutPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="999954979809-h2t8if3vj0s328ug716si26sqtllphed.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />}>
            <Route index element={<ProductsPage />} /> 
            <Route path="signin" element={<SignInPage />} /> 
            <Route path="signup" element={<SignUpPage />} /> 
            <Route path="products" element={<ProductsPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<Orders />} />
            <Route path="contacts/:action" element={<AddOrUpdateContactPage />} />
            <Route path="products/:action" element={<AddOrUpdateProductPage />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="messages" element={<Messages />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
      </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)
