import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
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
import useGetUserRole from './hooks/useGetUserRole';
import Collections from "./pages/Collections";
const App = () => {

  const { currentUser } = useUserContext();
  const [admin] = useGetUserRole(currentUser);

  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/favorites' element={<Favorites />} />
        <Route path='/template' element={<Template />} />
        <Route path='/template/:id' element={<Template />} />
        <Route path='/infos' element={currentUser ? <Infos /> : <Navigate to='/' />} />
        <Route path='/orders' element={currentUser ? <Orders /> : <Navigate to='/' />} />
        <Route path='/purchase' element={<Purchase />} />
        <Route path='/search/:name/:id' element={<Search />} />
        <Route path='/collections/:name/:id' element={<Collections />} />
        <Route path='/payment' element={<Payment />} />

        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App;