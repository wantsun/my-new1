import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from "../views/login/Login";
import Detail from '../views/news/Detail';
import News from '../views/news/News';
import NewsSandBox from '../views/newssandbox/NewsSandbox';

export default function IndexRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/news" element={<News/>} />
                <Route path="/detail/:id" element={<Detail/>} />
                <Route path="/*" element={localStorage.getItem("token") ? <NewsSandBox /> : <Navigate to="/login" />}/>
            </Routes>
        </BrowserRouter>
    )
}
