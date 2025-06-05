import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About';
import Menu from './pages/Menu';
import Product from './pages/Product';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Order from './pages/Order';

const App = () => {
  const location = useLocation();
  const hideFooterPaths = ['/Login'];
  const hideShow = !hideFooterPaths.includes(location.pathname);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vm] lg:px-[9vm]'>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"

      />
      {hideShow && <Navbar />}
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/About' element={<About />} />
        <Route path='/Menu' element={<Menu />} />
        <Route path='/Products/:productId' element={<Product />} />
        <Route path='/Cart' element={<Cart />} />
        <Route path='/Place-order' element={<PlaceOrder />} />
        <Route path='/Login' element={<Login />} />
        <Route path='/Contact' element={<Contact />} />
        <Route path='/Order' element={<Order />} />
      </Routes>
      {hideShow && <Footer />}
    </div>
  )
}

export default App
