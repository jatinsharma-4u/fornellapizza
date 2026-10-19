import { lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'

// Route-level code splitting: only the home page ships in the initial bundle.
const Menu = lazy(() => import('./pages/Menu'))
const Order = lazy(() => import('./pages/Order'))
const Product = lazy(() => import('./pages/Product'))
const Build = lazy(() => import('./pages/Build'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Track = lazy(() => import('./pages/Track'))
const Orders = lazy(() => import('./pages/Orders'))
const Profile = lazy(() => import('./pages/Profile'))
const Favorites = lazy(() => import('./pages/Favorites'))
const Auth = lazy(() => import('./pages/Auth'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))
const Offers = lazy(() => import('./pages/Offers'))
const Reservations = lazy(() => import('./pages/Reservations'))
const Faq = lazy(() => import('./pages/Faq'))
const Legal = lazy(() => import('./pages/Legal'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Confirmation = lazy(() => import('./pages/Confirmation'))
const Notifications = lazy(() => import('./pages/Notifications'))

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="menu" element={<Menu />} />
        <Route path="order" element={<Order />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="build" element={<Build />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="track/:id" element={<Track />} />
        <Route path="orders" element={<Orders />} />
        <Route path="profile" element={<Profile />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="login" element={<Auth mode="login" />} />
        <Route path="signup" element={<Auth mode="signup" />} />
        <Route path="forgot-password" element={<Auth mode="forgot" />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="offers" element={<Offers />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="confirmation/:id" element={<Confirmation />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="help" element={<Faq />} />
        <Route path="faq" element={<Navigate to="/help" replace />} />
        <Route path="privacy" element={<Legal doc="privacy" />} />
        <Route path="terms" element={<Legal doc="terms" />} />
        <Route path="refund-policy" element={<Legal doc="refund" />} />
        <Route path="delivery-policy" element={<Legal doc="delivery" />} />
        <Route path="legal" element={<Navigate to="/privacy" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
