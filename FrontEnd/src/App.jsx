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
import Feedback from './pages/Feedback';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import ScrollToTop from './components/ScrollToTop';
// import ProfileModal from './components/ProfileModal';

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Order from './pages/Order';
import Profile from './pages/Profile';
import NotFoundPage from './pages/NotFoundPage';


const App = () => {
  const location = useLocation();
  const hideFooterPaths = ['/Login'];
  const validPaths = [
    '/', '/About', '/Menu', '/Cart', '/Place-order', '/Login', '/Contact', '/Order', '/Profile', '/Feedback'
  ];
  const isNotFound = !(
    validPaths.includes(location.pathname) ||
    location.pathname.toLowerCase().startsWith('/products/')
  );
  const hideShow = !hideFooterPaths.includes(location.pathname) && !isNotFound;

  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vm] lg:px-[9vm]'>
      <ScrollToTop />
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={true}
        theme="light"
        toastStyle={{
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
        }}
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
        <Route path='/Profile' element={<Profile />} />
        <Route path='/Feedback' element={<Feedback />} />
        <Route path='/*' element={<NotFoundPage />} />
        {/* <Route path='/Profile' element={<ProfileModal />} /> */}
      </Routes>
      {hideShow && <Footer />}
    </div>
  )
}

export default App
