import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions,notification } from 'antd';
import { useParams } from "react-router";
import moment from 'moment'
import axios from 'axios';
import {LikeOutlined} from '@ant-design/icons'
export default function Detail() {
    const [newsInfo, setnewsInfo] = useState(null);
    const [like,setLike]=useState(false);
    const [refresh,setRefresh]=useState(null);
    let star = localStorage.getItem("star") || [];
    const params = useParams();
    useEffect(() => {
        // console.log()
        axios.get(`/news/${params.id}?_expand=category&_expand=role`).then(res => {
            setnewsInfo({
                ...res.data,
                view:res.data.view+1
            })

            //同步后端
            return res.data
        }).then(res=>{
            axios.patch(`/news/${params.id}`,{
                view:res.view+1
            })
        })
    }, [params.id,refresh])
    // const handleStar = ()=>{
    //     setnewsInfo({
    //         ...newsInfo,
    //         star:newsInfo.star+1
    //     })
    //     setLike({like:true});
    //     axios.patch(`/news/${params.id}`,{
    //         star:newsInfo.star+1
    //     })
    // }
    const handleStar = () => {
        setLike({like:true});
        if (!star.includes(params.id.toString())) {
            axios.patch(`/news/${params.id}`,{
                        star:newsInfo.star+1
                    })
            .then(() => {
              setRefresh();
              const arr = [...star];
              localStorage.setItem("star", arr.concat(params.id));
            },[refresh])
            .catch((e) => console.log(e));
        } else {
          notification.info({
            message: "error",
            description: "starError",
            placement: "bottomRight",
          });
        }
      };

    return (
        <div>
            {
                newsInfo && <div>

                    <PageHeader
                        onBack={() => window.history.back()}
                        title={newsInfo.title}
                        subTitle={<div>
                            {newsInfo.category.title}
                            <LikeOutlined  style={{color:like?"red":""}}   twoToneColor="#eb2f96" onClick={()=>handleStar()}/>

                        </div>}
                    >
                        <Descriptions size="small" column={3}>
                            <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                           
                            <Descriptions.Item label="发布时间">{
                                newsInfo.publishTime ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss") : "-"
                            }</Descriptions.Item>
                            <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                           
                            <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                            <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                            <Descriptions.Item label="评论数量">0</Descriptions.Item>

                        </Descriptions>
                    </PageHeader>

                    <div dangerouslySetInnerHTML={{
                        __html:newsInfo.content
                    }} style={{
                        margin:"0 24px",
                        border:"1px solid gray"
                    }}>
                    </div>
                </div>
            }
        </div>
    )
}
