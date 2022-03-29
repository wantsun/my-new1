import $http from "../../../util/http";
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal,Tree } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function RoleList() {
    const [dataSource, setDataSource] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [currentRights, setcurrentRights] = useState([])
    const [currentID, setcurrentID] = useState(0)
    const [isModalVisible, setisModalVisible] = useState(false)
    const [rightList, setRightList] = useState([])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName'
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={()=>{
                        setisModalVisible(true)
                        setcurrentRights(item.rights)
                        setcurrentID(item.id);
                    }}/>
                </div>
            }
        }
    ]

    useEffect(() => {
        $http.get("/roles").then((res) => {
            setDataSource(res.data);
            console.log("dataSource",res.data)
        });
    }, [refresh]);

    useEffect(() => {
        $http.get("/rights?_embed=children").then(res => {
            setRightList(res.data)
            console.log("rightList",res.data)
        })
    }, [])


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
        $http.delete(`/roles/${item.id}`)
            .then(setRefresh)
            .catch((e) => console.log(e))
    }



    const handleOk = ()=>{
        setisModalVisible(false);
        $http.patch(`/roles/${currentID}`,{
            rights:currentRights.checked
        })
            .then(setRefresh)
            .catch((e) => console.log(e))

    }

    const handleCancel  =()=>{
        setisModalVisible(false)
    }

    const onCheck = (checkKeys)=>{
        // console.log(checkKeys)
        setcurrentRights(checkKeys)
    }

     

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                rowKey={(item) => item.id}
            />
            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkable
                    checkedKeys = {currentRights}
                    onCheck={onCheck}
                    checkStrictly = {true}
                    treeData={rightList}
                />
            </Modal>
        </div>
    )
}
