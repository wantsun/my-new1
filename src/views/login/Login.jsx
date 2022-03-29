import React from 'react'
import Background from '../../asserts/images/bg1.jpg'
import "./Login.css"
import { Form, Input, Button, message } from 'antd';
import {useNavigate}from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import $http from '../../util/http';
import Auth from '../../router/Auth'


export default function Login() {
    let navigate=useNavigate();
    const { login, logout } = Auth()
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        $http.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(res=>{
            console.log(res.data)
            if(res.data.length===0){
                message.error("用户名或密码不匹配")
            }else{
                message.info('登录成功');
                localStorage.setItem("token",JSON.stringify(res.data[0]));
                navigate("/home");
            }
        })
    };

    
    return (
        <div className="login" style={{ backgroundImage: `url(${Background})` }}>
        <div className=" formContainer" >
            <div className="logintitle">招聘发布管理系统</div>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!' }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="密码"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button" autocomplet="on"  onClick={() => login()}>
                        Log in
        </Button>
                </Form.Item>
            </Form>
        </div>
        </div>
    )
}
