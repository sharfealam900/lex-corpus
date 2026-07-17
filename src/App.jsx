import { useState } from 'react'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Home from './Components/Pages/Home'
import Hero from './Components/Hero'
import Practice from './Components/Practice'
import About from './Components/About'
import Insights from './Components/Insights'
import ContactUs from './Components/ContactUs'
import Blog from './Components/Blog'

import LoginPage from './Components/Pages/User/LoginPage'
import SignupPage from './Components/Pages/User/signupPage'
import Account from './Components/Pages/Account'
import ProtectedRoute from './Components/ProtectedRoute'

function App() {

  return (
    <>
      <BrowserRouter>
     
      
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/hero' element={<Hero/>} />
          <Route path='/practice' element={<Practice/>}/>
          <Route path='/about' element={<About/>}/>
          <Route path='/insights' element={<Insights/>}/>
          <Route path='/contactUs' element={<ContactUs/>}/>
          <Route path='/blog' element={<Blog/>}/>


          <Route path='/login' element={<LoginPage/>}/>
          <Route path='/signup' element={<SignupPage/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='/protectedroute' element={<ProtectedRoute/>}/>

        </Routes>
        <Footer/>

      </BrowserRouter>
    </>
  )

}

export default App
