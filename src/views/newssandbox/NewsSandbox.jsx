import React,{useEffect} from 'react'

import SideMenu from '../../components/sanbox/SideMenu'
import TopHeader from '../../components/sanbox/TopHeader'
import NewsRouter from '../../components/sanbox/NewsRouter'
import {useNavigate}from 'react-router-dom';
import { Layout } from 'antd';
import "./News.modules.css";

import Nprogress from 'nprogress';
import 'nprogress/nprogress.css';


const { Content } = Layout;

export default function Sandbox() {
    Nprogress.start();
    useEffect(()=>{
        Nprogress.done()
    }
    )
    let navigate=useNavigate();
    useEffect(()=>{
        if(!localStorage.getItem("token")){
            console.log("我执行")
            navigate("/login")
        }
    },[])
    return (
        <Layout>
            <SideMenu />
            <Layout className="site-layout">
                <TopHeader />
                <Content className="site-layout-background"
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        overflow: "auto",
                    }}>
                    <NewsRouter/>
                </Content>
            </Layout>
        </Layout>
  
       
    )
}
