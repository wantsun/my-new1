import React, { useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import './SideMenu.css';
import { UserOutlined,HomeOutlined,RightSquareOutlined,OrderedListOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from "react-router-dom";
import $http from "../../util/http";
import {connect} from 'react-redux';
const { SubMenu } = Menu;
const { Sider } = Layout;

const iconList = {
  "/home": <HomeOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <RightSquareOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <OrderedListOutlined />
  //.......
}


 function SideMenu(props) {
  const [meus, setMeun] = useState([]);
  useEffect(() => {
    $http.get("/rights?_embed=children").then(res => {
      console.log(res.data)
      setMeun(res.data)
    })
  }, [])

  const {role:{rights}} = JSON.parse(localStorage.getItem("token")||'')

  const checkPagePermission = (item)=>{
    return item.pagepermisson && rights.includes(item.key)
  }

  let Navigate = useNavigate();
  let location = useLocation();
  const selectKeys = [location.pathname]; 
  const openKeys = ["/" + location.pathname.split("/")[1]];
  const renderMenu = (menuList) => {
    return menuList.map(item => {
      if (item.children?.length > 0 && checkPagePermission(item)) {
        return (
          <SubMenu key={item.key} icon={iconList[item.key]} title={item.title}>
            {renderMenu(item.children)}
          </SubMenu>

        )
      }
      return checkPagePermission(item) && <Menu.Item key={item.key} icon={iconList[item.key]}
        onClick={() => { Navigate(item.key) }}>{item.title}</Menu.Item>
    })
  }


  return (
    <Sider trigger={null} collapsible collapsed={props.isCollapsed} >
      <div style={{ display: "flex", height: "100%", "flexDirection": "column" }}>
        <div className="logo" >招聘发布管理系统</div>
        <div style={{ flex: 1, "overflow": "auto" }}>
          <Menu theme="dark" mode="inline" selectedKeys={selectKeys} defaultOpenKeys={openKeys}>
            {renderMenu(meus)}
          </Menu>
        </div>
      </div>
    </Sider>
  )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}})=>({
  isCollapsed
})
export default connect(mapStateToProps)(SideMenu)