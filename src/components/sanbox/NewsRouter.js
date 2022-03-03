import React, { useState, useEffect } from 'react'
import Home from '../../views/newssandbox/home/Home'
import Nopermission from '../../views/newssandbox/nopermission/NoPermission'
import RightList from '../../views/newssandbox/right-manage/RightList'
import RoleList from '../../views/newssandbox/right-manage/RoleList'
import UserManage from '../../views/newssandbox/user-manage/UserManage'
import NewsAdd from '../../views/newssandbox/news-manage/NewsAdd'
import NewsDraft from '../../views/newssandbox/news-manage/NewsDraft'
import NewsCategory from '../../views/newssandbox/news-manage/NewsCategory'
import Audit from '../../views/newssandbox/audit-manage/Audit'
import AuditList from '../../views/newssandbox/audit-manage/AuditList'
import Unpublished from '../../views/newssandbox/publish-manage/Unpublished'
import Published from '../../views/newssandbox/publish-manage/Published'
import Sunset from '../../views/newssandbox/publish-manage/Sunset'
import NewsPreview from '../../views/newssandbox/news-manage/NewsPreview'
import axios from "axios";
import { Routes, Route, Navigate } from 'react-router-dom'
import NewsUpdate from '../../views/newssandbox/news-manage/NewsUpdate'
import {Spin } from 'antd'
import {connect} from 'react-redux'
const LocalRouterMap = {
    "/home": <Home />,
    "/user-manage/list": <UserManage />,
    "/right-manage/role/list": <RoleList />,
    "/right-manage/right/list": <RightList />,
    "/news-manage/add": <NewsAdd />,
    "/news-manage/draft": <NewsDraft />,
    "/news-manage/category": <NewsCategory />,
    "/news-manage/preview/:id":<NewsPreview/>,
    "/news-manage/update/:id":<NewsUpdate/>,
    "/audit-manage/audit": <Audit />,
    "/audit-manage/list": <AuditList />,
    "/publish-manage/unpublished": <Unpublished />,
    "/publish-manage/published": <Published />,
    "/publish-manage/sunset": <Sunset />,
};

function NewsRouter(props) {
    const [backRouteList, setbackRouteList] = useState([]);

    const { role: { rights } } = JSON.parse(localStorage.getItem("token"))

    const checkRoute = (item) => {
        return LocalRouterMap[item.key] && (item.pagepermisson||item.routepermisson)
    }

    const checkUserPermission = (item) => {
        return rights.includes(item.key)
    }

    useEffect(() => {
        Promise.all([
            axios.get("/rights"),
            axios.get("/children"),
        ]).then((res) => {
            setbackRouteList([...res[0].data, ...res[1].data]);
        });
    }, []);

    return (
        <Spin size="large" spinning={props.isLoading}>
        <Routes>
               {
                backRouteList.map(item=>
                    {
                        if(checkRoute(item) && checkUserPermission(item)){
                            return <Route path={item.key} key={item.key} element={LocalRouterMap[item.key]} exact/> 
                        }
                        return null
                    }   
                )
            }  
            <Route path="/" element={<Navigate replace from="/" to="/home" />} />
            { backRouteList.length > 0 && <Route path="/*" element={<Nopermission />} />
            }
        </Routes>
        </Spin>
    );
}

const mapStateToProps = ({LoadingReducer:{isLoading}})=>({
    isLoading
  })

export default connect(mapStateToProps)(NewsRouter)