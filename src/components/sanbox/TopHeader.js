import React from 'react'
import { Layout, Dropdown,Menu,Avatar } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined
} from '@ant-design/icons';
import {useNavigate}from 'react-router-dom';
import {connect} from 'react-redux';


const { Header } = Layout;

 function TopHeader(props) {
   console.log(props.isCollapsed)
  // const [collapsed, setCollapsed] = useState(false);
  const changeCollapsed = () => {
    // setCollapsed(!collapsed);
    // console.log(props)
    props.changeCollapsed()
  }

  const {role:{roleName},username} = JSON.parse(localStorage.getItem("token")||'');
  let navigate=useNavigate();

  const menu = (
    <Menu>
      <Menu.Item>
      {roleName}
      </Menu.Item>
      <Menu.Item danger onClick={()=>{
        localStorage.removeItem("token");
        navigate("/login");
      }}>退出</Menu.Item>
    </Menu>
  );
 
  return (
    <Header className="site-layout-background" style={{ padding: "0 16px" }}>
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }
      <div style={{ float: "right" }}>
        <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回家</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}

const mapStateToProps=({CollApsedReducer:{isCollapsed}})=>{
  // console.log("state",state)
  return {
    isCollapsed
  }
}

const mapDispatchToProps = {
  changeCollapsed(){
      return {
          type: "change_collapsed"
          // payload:
      }//action 
  }
}



export default  connect(mapStateToProps,mapDispatchToProps)(TopHeader);
