import React from 'react';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';

import Login from "../views/login/Login";
import Detail from '../views/news/Detail';
import News from '../views/news/News';
import NewsSandBox from '../views/newssandbox/NewsSandbox';
import { AuthProvider, RequireAuth } from '../router/Auth'

export default function IndexRouter() {
    
    return (
        <BrowserRouter>
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/news" element={<News/>} />
                <Route path="/detail/:id" element={<Detail/>} />
                {/* <Route path="/*" element={ <NewsSandBox />} /> */}
                {/* <Route path="/*" element={localStorage.getItem("token") ?  <NewsSandBox/> : <Navigate   replace to="/login"/>} /> */}
                <Route path="/*" element={
                    <RequireAuth>
                    <NewsSandBox/> 
                    </RequireAuth>
                } />
                
            </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}


