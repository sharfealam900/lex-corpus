import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./Components/Pages/Home";
import Hero from "./Components/Hero";
import Practice from "./Components/Practice";
import About from "./Components/About";
import Insights from "./Components/Insights";
import ContactUs from "./Components/ContactUs";
import Blog from "./Components/Blog";
import ArticleDetails from "./Components/Pages/ArticleDetails";

import LoginPage from "./Components/Pages/User/LoginPage";
import SignupPage from "./Components/Pages/User/SignupPage";

import Account from "./Components/Pages/Account";
import ProtectedRoute from "./Components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import AdminDashboard from "./Components/Pages/AdminDashboard";
import AdminQueries from "./Components/Pages/AdminQueries";
import AdminArticles from "./Components/Pages/AdminArticles";
import CreateArticle from "./Components/Pages/CreateArticle";
import EditArticle from "./Components/Pages/EditArticle";
import AdminSettings from "./Components/Pages/AdminSettings";
import PracticeManagement from "./Components/Pages/PracticeManagement";



function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/about" element={<About />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/article/:id" element={<ArticleDetails />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

  
        <Route path="/account" element={<ProtectedRoute> <Account /></ProtectedRoute> }/>
   
        <Route path="/admin/dashboard"element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>}/>

        <Route path="/admin/queries"element={<ProtectedAdminRoute> <AdminQueries /></ProtectedAdminRoute>}/>

        <Route path="/admin/articles"element={<ProtectedAdminRoute><AdminArticles /> </ProtectedAdminRoute>}/>

        <Route path="/admin/articles/create" element={<ProtectedAdminRoute> <CreateArticle /> </ProtectedAdminRoute> }/>
     
        <Route path="/admin/articles/edit/:id" element={ <ProtectedAdminRoute> <EditArticle /> </ProtectedAdminRoute> }/>

        <Route path="/admin/settings" element={<ProtectedAdminRoute><AdminSettings /></ProtectedAdminRoute>}/>

        <Route path="/admin/practice" element={<PracticeManagement/>}/>

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;