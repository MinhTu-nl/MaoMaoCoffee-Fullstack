import React from 'react'
import Navbar from './conponents/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import 'react-toastify/dist/ReactToastify.css';
import About from './pages/About';
import Menu from './pages/Menu';
import Product from './pages/Product';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Footer from './conponents/Footer';
import SearchBar from './conponents/SearchBar';


const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vm] lg:px-[9vm]'>
      <Navbar />
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

      </Routes>
      <Footer />
    </div>
  )
}

export default App
