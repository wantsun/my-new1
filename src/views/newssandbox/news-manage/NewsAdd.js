import React, { useEffect, useState,useRef } from 'react'
import { PageHeader, Steps, Button,Form, Input,Select, message,notification } from 'antd'
import {useNavigate} from "react-router"
import style from './News.module.css'
import  axios from 'axios'
import NewsEditor from '../../../components/news-mange/NewsEditor';
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd() {
    const [current, setCurrent] = useState(0);
    const[categoryList,setCategoryList]=useState([]);
    const [formInfo,setformInfo] =useState({});
    const [content,setContent]=useState({});
    const Navigate=useNavigate()
    const User = JSON.parse(localStorage.getItem("token"))

    const handleNext = () => {
       if(current===0){
        NewsForm.current.validateFields().then(res=>{
            console.log(res)
            setformInfo(res)
            setCurrent(current + 1)
        }).catch(error=>{
            console.log(error)
        })
       }else{
           if(content===''||content.trim()==="<p></p>"){
            message.error("招聘内容不能为空")
           }else{
            console.log(formInfo,content)
            setCurrent(current + 1)
           }
        
       }
    }

    const handleSave = (auditState) => {

        axios.post('/news', {
            ...formInfo,
            "content": content,
            "region": User.region?User.region:"中国",
            "author": User.username,
            "roleId": User.roleId,
            "auditState": auditState,
            "publishState": 0,
            "createTime": Date.now(),
            "star": 0,
            "view": 0,
            // "publishTime": 0
        }).then(res=>{
            Navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')

            notification.info({
                message: `通知`,
                description:
                  `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的招聘`,
                placement:"bottomRight",
            });
        })
    }

    const handlePrevious = () => {
        setCurrent(current - 1)
    }

    const NewsForm=useRef(null);

    useEffect(()=>{
        axios.get("/categories").then(res=>{
            setCategoryList(res.data)
        })
    },[])
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="撰写招聘"
                subTitle="This is a subtitle"
            />

            <Steps current={current}>
                <Step title="基本信息" description="招聘标题，招聘分类" />
                <Step title="招聘内容" description="招聘主体内容" />
                <Step title="招聘提交" description="保存草稿或者提交审核" />
            </Steps>

            <div style={{margin:"50px"}}>
            <div className={current === 0 ? '' : style.active}>
            <Form  
                name="basic"
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 20,
                }}
                initialValues={{
                    remember: true,
                }}
                autoComplete="off"

                ref={NewsForm}
            >
                <Form.Item
                    label="招聘标题"
                    name="title"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的招聘标题!',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="招聘分类"
                    name="categoryId"
                    rules={[
                        {
                            required: true,
                            message: '请输入你的招聘标题!',
                        },
                    ]}
                >
                    <Select>
                       {
                           categoryList.map((item)=>{
                              return <Option value={item.id} key={item.id}>{item.title}</Option>
                           }
                               
                           )
                       }
                    </Select>
                </Form.Item>
            </Form>
            </div>


            <div className={current === 1 ? '' : style.active}>
               <NewsEditor getContent={(value)=>{
                  setContent(value)
               }}></NewsEditor>
            </div>
            <div className={current === 2 ? '' : style.active}></div>
            </div>
           

            <div style={{ marginTop: "50px" }}>
                {
                    current === 2 && <span>
                        <Button type="primary" onClick={() => handleSave(0)}>保存草稿箱</Button>
                        <Button danger onClick={() => handleSave(1)}>提交审核</Button>
                    </span>
                }
                {
                    current < 2 && <Button type="primary" onClick={handleNext}>下一步</Button>
                }
                {
                    current > 0 && <Button onClick={handlePrevious}>上一步</Button>
                }
            </div>
        </div>
    )
}
