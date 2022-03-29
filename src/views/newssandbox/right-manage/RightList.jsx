import React, { useState, useEffect } from 'react';
import $http from "../../../util/http";
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

export default function RightList() {
    
    const [dataSource, setDataSource] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        $http.get("/rights?_embed=children").then((res) => {
            res.data.forEach((item) =>
                item.children?.length === 0 ? (item.children = "") : item.children
            );
            setDataSource(res.data);
        });
    }, [refresh]);

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "权限名称",
            dataIndex: "title",
        },
        {
            title: "权限路径",
            dataIndex: "key",
            render: (key) => {
                return <Tag color="volcano">{key}</Tag>;
            },
        },
        {
            title: "操作",
            render: (item) => {
                return (
                    <div>
                        <Button
                            danger
                            shape="circle"
                            icon={<DeleteOutlined />}
                            style={{ marginRight: 10 }}
                            onClick={() => confirmMethod(item)}
                        />
                        <Popover
                            content={
                                <div style={{textAlign:'center'}}><Switch checked={item.pagepermisson} onChange={()=>switchMethod(item)}
                                ></Switch></div>
                            }
                            title="配置项"
                            trigger={item.pagepermisson===undefined?'':"click"}
                        >
                            <Button type="primary" shape="circle" icon={<EditOutlined />}
                                disabled={item.pagepermisson===undefined}
                            />
                        </Popover>
                        
                    </div>
                );
            },
        },
    ];

    const confirmMethod = (item) => {
        confirm({
            title: "你确定要删除?",
            icon: <ExclamationCircleOutlined />,
            // content: "Some descriptions",
            onOk() {
                deleteMethod(item);
            },
            onCancel() {
                console.log("Cancel");
            },
        });
    };

    const deleteMethod = (item) => {
        if (item.grade === 1) {
            $http.delete(`/rights/${item.id}`)
                .then(setRefresh)
                .catch((e) => console.log(e))
        } else {
            $http.delete(`/children/${item.id}`)
                .then(setRefresh)
                .catch((e) => console.log(e))
        }
    }

    const switchMethod=(item)=>{
        item.pagepermisson=item.pagepermisson===1?0:1;
        setDataSource([...dataSource]);

        if(item.grade===1){
            $http.patch(`/rights/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }else{
            $http.patch(`/children/${item.id}`,{
                pagepermisson:item.pagepermisson
            })
        }
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }} 
                rowKey={item=>item.id}
                />
        </div>
    )

}
