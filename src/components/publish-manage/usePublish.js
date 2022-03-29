import {useEffect, useState} from 'react'
import $http from "../../util/http";
import {notification} from 'antd'

function usePublish(type){
    const {username} = JSON.parse(localStorage.getItem("token"))

    const [dataSource, setdataSource] = useState([])
    useEffect(() => {

        $http(`/news?author=${username}&publishState=${type}&_expand=category`).then(res=>{
            // console.log(res.data)
            setdataSource(res.data)
        })
    }, [username,type])



    const handlePublish = (id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))

        $http.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime":Date.now()
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您可以到【发布管理/已经发布】中查看您的招聘`,
                placement:"bottomRight"
            });
        })
    }

    const handleSunset = (id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))

        $http.patch(`/news/${id}`, {
            "publishState": 3,
        }).then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您可以到【发布管理/已下线】中查看您的招聘`,
                placement:"bottomRight"
            });
        })
    }

    const handleDelete = (id)=>{
        setdataSource(dataSource.filter(item=>item.id!==id))

        $http.delete(`/news/${id}`).then(res=>{
            notification.info({
                message: `通知`,
                description:
                  `您已经删除了已下线的招聘`,
                placement:"bottomRight"
            });
        })

    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish