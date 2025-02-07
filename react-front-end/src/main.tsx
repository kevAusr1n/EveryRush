import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter, Route, Routes } from 'react-router'
import Register from './component/Register.tsx'
import LogIn from './component/LogIn.tsx'
import BrowsePage from './component/BrowsePage.tsx'
import Cart from './component/Cart.tsx'
import Products from './component/Products.tsx'
import Orders from './component/Orders.tsx'
import Contacts from './component/Contacts.tsx'
import Messages from './component/Messages.tsx'
import Checkout from './component/Checkout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="999954979809-h2t8if3vj0s328ug716si26sqtllphed.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="signin" element={<LogIn />} /> 
          <Route path="signup" element={<Register />} /> 
          <Route path="/" element={<BrowsePage />}>
            <Route path="products" element={<Products />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="messages" element={<Messages />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
      </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)
