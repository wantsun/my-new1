
import React, { useEffect, useState, useRef } from 'react'
import { PageHeader, Steps, Button, Form, Input, Select, message,notification } from 'antd'
import {useNavigate,useParams} from "react-router"
import style from './News.module.css'
import $http from '../../../util/http'
import NewsEditor from '../../../components/news-mange/NewsEditor';
const { Step } = Steps;
const { Option } = Select;

export default function NewsUpdate() {
    const [current, setCurrent] = useState(0)
    const [categoryList, setCategoryList] = useState([])

    const [formInfo, setformInfo] = useState({})
    const [content, setContent] = useState("")
    const Navigate=useNavigate()
    const {id}=useParams();

    const handleNext = () => {
        if (current === 0) {
            NewsForm.current.validateFields().then(res => {

                setformInfo(res)
                setCurrent(current + 1)
            }).catch(error => {
                console.log(error)
            })
        } else {
            
            if (content === "" || content.trim() === "<p></p>") {
                message.error("招聘内容不能为空")
            } else {
                setCurrent(current + 1)
            }
        }
    }
    const handlePrevious = () => {
        setCurrent(current - 1)
    }

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 },
    }

    const NewsForm = useRef(null)

    useEffect(() => {
        $http.get("/categories").then(res => {
          
            setCategoryList(res.data)
        })
    }, [])

    useEffect(() => {
        // console.log()
        $http.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
           
            let {title,categoryId,content} = res.data
            console.log("content",content)
            NewsForm.current.setFieldsValue({
                title,
                categoryId
            })

            setContent(content)
        })
    }, [id])


    const handleSave = (auditState) => {

        $http.patch(`/news/${id}`, {
            ...formInfo,
            "content": content,
            "auditState": auditState,
        }).then(res=>{
            Navigate(auditState===0?'/news-manage/draft':'/audit-manage/list')

            notification.info({
                message: `通知`,
                description:
                  `您可以到${auditState===0?'草稿箱':'审核列表'}中查看您的招聘`,
                placement:"bottomRight"
            });
        })
    }

    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="更新招聘"
                onBack={() => Navigate(-1)}
                subTitle="This is a subtitle"
            />

            <Steps current={current}>
                <Step title="基本信息" description="招聘标题，招聘分类" />
                <Step title="招聘内容" description="招聘主体内容" />
                <Step title="招聘提交" description="保存草稿或者提交审核" />
            </Steps>


            <div style={{ marginTop: "50px" }}>
                <div className={current === 0 ? '' : style.active}>

                    <Form
                        {...layout}
                        name="basic"
                        ref={NewsForm}
                    >
                        <Form.Item
                            label="招聘标题"
                            name="title"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="招聘分类"
                            name="categoryId"
                            rules={[{ required: true, message: 'Please input your username!' }]}
                        >
                            <Select>
                                {
                                    categoryList.map(item =>
                                        <Option value={item.id} key={item.id}>{item.title}</Option>
                                    )
                                }
                            </Select>
                        </Form.Item>

                    </Form>
                </div>

                <div className={current === 1 ? '' : style.active}>
                    <NewsEditor getContent={(value) => {
                        console.log("value",value)
                        setContent(value)
                    }} content={content}></NewsEditor>
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

