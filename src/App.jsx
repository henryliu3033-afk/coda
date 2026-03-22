import { BrowserRouter, Routes, Route } from 'react-router'
import Navbar      from './components/layout/Navbar'
import Footer      from './components/layout/Footer'
import Home        from './pages/Home'
import Events      from './pages/Events'
import EventDetail from './pages/EventDetail'
import Cart        from './pages/Cart'
import Checkout    from './pages/Checkout'
import MyTickets   from './pages/MyTickets'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/events"     element={<Events />} />
            <Route path="/event/:id"  element={<EventDetail />} />
            <Route path="/cart"       element={<Cart />} />
            <Route path="/checkout"   element={<Checkout />} />
            <Route path="/my-tickets" element={<MyTickets />} />
            <Route path="*"           element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
