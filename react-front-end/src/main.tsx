import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Route, Routes } from 'react-router'
import Register from './pages/Register.tsx'
import LogIn from './pages/LogIn.tsx'
import BrowsePage from './pages/BrowsePage.tsx'
import Cart from './pages/Cart.tsx'
import Products from './pages/Products.tsx'
import Orders from './pages/Orders.tsx'
import Contacts from './pages/Contacts.tsx'
import Messages from './pages/Messages.tsx'
import Checkout from './pages/Checkout.tsx'
import AddOrUpdateContact from './pages/AddOrUpdateContact.tsx'
import AddOrUpdateProduct from './pages/AddOrUpdateProduct.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="999954979809-h2t8if3vj0s328ug716si26sqtllphed.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="signin" element={<LogIn />} /> 
          <Route path="signup" element={<Register />} /> 
          <Route path="browse" element={<BrowsePage />}>
            <Route index element={<Products />} />
            <Route path="products" element={<Products />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            <Route path="contacts/:action" element={<AddOrUpdateContact />} />
            <Route path="products/:action" element={<AddOrUpdateProduct />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="messages" element={<Messages />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
      </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)
