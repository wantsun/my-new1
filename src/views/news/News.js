import React, { useEffect, useState } from 'react'
import axios from 'axios'
import _ from 'lodash'
import { PageHeader,  Col, Row, List } from 'antd'
import { Layout, Menu } from 'antd';
import "./New.module.css";

import {
    EyeOutlined,
    StarOutlined
  } from '@ant-design/icons';
const { Content, Footer, Sider } = Layout;
export default function News() {
    const [list, setlist] = useState([])
    const [number,setNumber]=useState(1);
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then(res => {
            setlist(Object.entries(_.groupBy(res.data, item => item.category.title)))
        })

    }, [])

    const action=(id)=>{
        setNumber(id);
    }
   
    return (
        <Layout>
            <PageHeader
                className="site-page-header"
                title="中国招聘"
                subTitle="查看招聘"
            />
            <Content style={{ padding: '0 50px' }}>
                <Layout className="site-layout-background" style={{ padding: '24px 0' }}>
                    <Sider className="site-layout-background" width={200}
                        style={{
                            overflow: 'auto',
                        }}
                    >
                        <Menu
                            mode="inline"
                            style={{ height: '100%' }}
                        >
                            {
                                list.map((item,index) =>
                                  
                                    <Menu.Item key={item[0]} onClick={()=>action(index)} >
                                        {
                                            item[0]
                                        }
                                    </Menu.Item>
                                )
                            }
                        </Menu>
                    </Sider>

                    <Content style={{ padding: '0 24px', minHeight: 280, background: "#fff" }}>
                        {
                            console.log(list),
                            list.map((item,index) =>
                                <Row>
                                    <Col span={4}></Col>
                                    <Col span={16}> 
                                    <List  
                                        key={item[0]}
                                        style={
                                            {
                                                display:  number===index?'block':'none',
                                                marginTop:"30px"
                                            }
                                            
                                        }
                                        size="small"
                                        dataSource={item[1]}
                                        hideOnSinglePage={true}
                                        pagination={{
                                            pageSize: 8
                                        }}
                            
                                        renderItem={data => <List.Item><a href={`/detail/${data.id}`}>{data.title}</a><span style={{float:"right"}}><EyeOutlined />{data.view} <StarOutlined />{data.star}</span></List.Item>}
                                    />
                                    </Col>
                                    <Col span={4}></Col>
                                </Row>
                            )
                        }
                    </Content>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )

}
