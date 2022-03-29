


import React, { useState, useEffect, useRef } from 'react'
import { Button, Table, Modal, Switch} from 'antd'
import $http from '../../../util/http'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import UserForm from '../../../components/user-mange/UserForm';
const { confirm } = Modal

export default function UserList() {
    const [dataSource, setdataSource] = useState([])
    const [isAddVisible, setisAddVisible] = useState(false)
    const [isUpdateVisible, setisUpdateVisible] = useState(false)
    const [roleList, setroleList] = useState([])
    const [regionList, setregionList] = useState([])
    const [current, setcurrent] = useState(null)
    const [refresh, setRefresh] = useState(false);

    const [isUpdateDisabled, setisUpdateDisabled] = useState(false)
    const addForm = useRef(null)
    const updateForm = useRef(null)

    const {roleId,region,username}  = JSON.parse(localStorage.getItem("token"))
    
    useEffect(() => {
        const roleObj = {
            "1":"superadmin",
            "2":"admin",
            "3":"editor"
        }
        $http.get("/users?_expand=role").then(res => {
            const list = res.data
            console.log(list);
            setdataSource(roleObj[roleId]==="superadmin"?list:[
                ...list.filter(item=>item.username===username),
                ...list.filter(item=>item.region===region&& roleObj[item.roleId]==="editor")
            ])
        })
    }, [refresh,roleId,region,username])

    useEffect(() => {
        $http.get("/regions").then(res => {
            const list = res.data
            setregionList(list)
        })
    }, [refresh])

    useEffect(() => {
        $http.get("/roles").then(res => {
            const list = res.data
            setroleList(list)
        })
    }, [])

    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters: [
                ...regionList.map(item=>({
                    text:item.title,
                    value:item.value
                })),
                {
                    text:"中国",
                    value:"中国"
                }    

            ],

            onFilter:(value,item)=>{
                if(value==="中国"){
                    return item.region===""
                }
                return item.region===value
            },
          
            render: (region) => {
                return <b>{region === "" ? '中国' : region}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: "用户名",
            dataIndex: 'username'
        },
        {
            title: "用户状态",
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={()=>handleChange(item)}></Switch>
            }
        },
        {
            title: "操作",
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} disabled={item.default} />

                    <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={()=>handleUpdate(item)}/>
                </div>
            }
        }
    ];

    const handleUpdate = (item)=>{
        setTimeout(()=>{
            setisUpdateVisible(true)
            if(item.roleId===1){
                //禁用
                setisUpdateDisabled(true)
            }else{
                //取消禁用
                setisUpdateDisabled(false)
            }
            updateForm.current.setFieldsValue(item)
        },0)

        setcurrent(item)
    }

    const handleChange = (item)=>{
        // console.log(item)
        item.roleState = !item.roleState
        setdataSource([...dataSource])

        $http.patch(`/users/${item.id}`,{
            roleState:item.roleState
        })
    }

    const confirmMethod = (item) => {
        confirm({
            title: '你确定要删除?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                //   console.log('OK');
                deleteMethod(item)
            },
            onCancel() {
                //   console.log('Cancel');
            },
        });

    }
    //删除
    const deleteMethod = (item) => {
        // console.log(item)
        // 当前页面同步状态 + 后端同步
        // setdataSource(dataSource.filter(data=>data.id!==item.id))

        $http.delete(`/users/${item.id}`).then(setRefresh)
        .catch((e) => console.log(e))
    }

    const addFormOK = () => {
        addForm.current.validateFields().then(value => {
            // console.log(value)

            setisAddVisible(false)

            addForm.current.resetFields()
            //post到后端，生成id，再设置 datasource, 方便后面的删除和更新
            $http.post(`/users`, {
                ...value,
                "roleState": true,
                "default": false,
            }).then(setRefresh)
            .catch((e) => console.log(e))
        })
    }

    const updateFormOK = ()=>{
        updateForm.current.validateFields().then(value => {
            setisUpdateVisible(false)
            setisUpdateDisabled(!isUpdateDisabled)
            $http.patch(`/users/${current.id}`,value).then(setRefresh)
            .catch((e) => console.log(e))
        })
    }

    return (
        <div>
            <Button type="primary" onClick={() => {
                setisAddVisible(true)
            }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />

            <Modal
                visible={isAddVisible}
                title="添加用户"
                okText="确定"
                cancelText="取消"
                onCancel={() => {
                    setisAddVisible(false)
                }}
                onOk={() => addFormOK()}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={addForm}></UserForm>
            </Modal>

            <Modal
                visible={isUpdateVisible}
                title="更新用户"
                okText="更新"
                cancelText="取消"
                onCancel={() => {
                    setisUpdateVisible(false)
                    setisUpdateDisabled(!isUpdateDisabled)
                }}
                onOk={() => updateFormOK()}
            >
                <UserForm regionList={regionList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled}></UserForm>
            </Modal>

        </div>
    )
}
