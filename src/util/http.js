import axios from 'axios'
import {store} from '../redux/store'
axios.defaults.baseURL="https://wantsun.herokuapp.com/api"
// axios.defaults.baseURL="http://localhost:8000"

// axios.defaults.headers

// axios.interceptors.request.use
// axios.interceptors.response.use

// axios.interceptors.request.use(function (config) {
//     // Do something before request is sent
//     // 显示loading
//     store.dispatch({
//         type:"change_loading",
//         payload:true
//     })
//     return config;
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   });

// Add a response interceptor
// axios.interceptors.response.use(function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data

//     store.dispatch({
//         type:"change_loading",
//         payload:false
//     })

//     //隐藏loading
//     return response;
//   }, function (error) {
//     // Any status codes that falls outside the range of 2xx cause this function to trigger
//     // Do something with response error
//     store.dispatch({
//         type:"change_loading",
//         payload:false
//     })

//      //隐藏loading
//     return Promise.reject(error);
//   });


const $http = axios.create();
$http.interceptors.request.use(config => {
    // 给请求头加上Authorization的字段,值为token
    config.headers.Authorization = window.sessionStorage.getItem('token')
    config.headers.authJWT = window.sessionStorage.getItem('token')
    store.dispatch({
      type:"change_loading",
      payload:true
  })
    return config
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  store.dispatch({
      type:"change_loading",
      payload:false
  })
  
   //隐藏loading
  return Promise.reject(error);
})

// 对响应进行拦截
$http.interceptors.response.use((response)=>{

    store.dispatch({
    type:"change_loading",
    payload:false
})
    // if(response.data.code==="200") {
    //     console.log('请求成功！');
    // }else{
    //     console.log('请求失败！');

    // }
    // if(response.status!==200) {
    //     alert("请求失败！")
    // }   
return response
},(err)=>{
  store.dispatch({
    type:"change_loading",
    payload:false
})
return Promise.reject(err);
})

export default $http;
