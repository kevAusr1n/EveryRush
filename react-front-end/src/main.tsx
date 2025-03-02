import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import OrdersPage from './pages/OrdersPage.tsx'
import ContactsPage from './pages/ContactsPage.tsx'
import MessagesPage from './pages/MessagesPage.tsx'
import SignInPage from './pages/SignInPage.tsx'
import SignUpPage from './pages/SignUpPage.tsx'
import IndexPage from './pages/IndexPage.tsx'
import ProductsPage from './pages/ProductsPage.tsx'
import AddOrUpdateContactPage from './pages/AddOrUpdateContactPage.tsx'
import AddOrUpdateProductPage from './pages/AddOrUpdateProductPage.tsx'
import CartPage from './pages/CartPage.tsx'
import CheckoutPage from './pages/CheckoutPage.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import UserInfoEditPage from './pages/UserInfoEditPage.tsx'
import ProductDetailPage from './pages/ProductDetaiPage.tsx'
import PasswordResetPage from './pages/PasswordResetPage.tsx'
import SignUpConfirmPage from './pages/SignUpConfirmPage.tsx'
import SignInRequiredPage from './pages/SignInRequiredPage.tsx'
import ThirdPartySignInCheckPage from './pages/ThirdPartySignInCheckPage.tsx'
import ChatPage from './pages/ChatPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IndexPage />}>
          <Route index element={<ProductsPage />} /> 
          <Route path="signin" element={<SignInPage />} /> 
          <Route path="signup" element={<SignUpPage />} /> 
          <Route path="third-party-signin-check" element={<ThirdPartySignInCheckPage />} />
          <Route path="password-changed-then-signin-required" element={<SignInRequiredPage message="you have changged your password. please sign in again" />} /> 
          <Route path="signup-confirm" element={<SignUpConfirmPage />} />
          <Route path="password-reset" element={<PasswordResetPage />} /> 
          <Route path="products" element={<ProductsPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="user/edit" element={<UserInfoEditPage />} />
          <Route path="product/:id" element={<ProductDetailPage />} />
          <Route path="contacts/:action" element={<AddOrUpdateContactPage />} />
          <Route path="products/:action" element={<AddOrUpdateProductPage />} />
          <Route path="contacts" element={<ContactsPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>
)
