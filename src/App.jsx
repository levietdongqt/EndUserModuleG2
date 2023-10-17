import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login/Login';
import Confirm from './pages/Login/Confirm'
import PasswordRecovery from './pages/Login/PasswordRecovery';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Infos from './pages/Info/Infos';
import Template from './pages/Template';
import Purchase from './pages/Purchase';
import Search from './pages/Search';
import Orders from './pages/Orders';
import Payment from './pages/Payment';
import { useUserContext } from './contexts/UserContext';
import Collections from './pages/Collections';
import Categories from "./pages/Categories";
const App = () => {

  const { currentUser } = useUserContext();

  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route
          path="/login/confirm"
          element={<Confirm />}
        />
        <Route
          path="/login/passwordrecovery"
          element={<PasswordRecovery />}
        />
        <Route path='/register' element={<Register />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/favorites' element={<Favorites />} />
        <Route path='/template' element={<Template />} />
        <Route path='/template/:name' element={<Template />} />
        <Route path='/infos' element={currentUser ? <Infos /> : <Navigate to='/' />} />
        <Route path='/orders' element={currentUser ? <Orders /> : <Navigate to='/' />} />
        <Route path='/purchase' element={<Purchase />} />
        <Route path='/search/:name' element={<Search />} />
        <Route path='/categories/:name' element={<Categories />} />
        <Route path='/categories/:name/collection/:name' element={<Collections />} />
        <Route path='/payment' element={<Payment />} />

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;