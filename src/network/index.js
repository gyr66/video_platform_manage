import axios from 'axios';
import router from "@/router";
// import {Message} from "element-ui";

// 创建一个axios实例
const network = axios.create({
  // 请求超时时间
  timeout: 3000,
  baseURL: 'http://localhost:8082',
  withCredentials: true
})

// 添加请求拦截器
network.interceptors.request.use(
  config => {
    return config
  },
  err => {
    console.log(err)
  }
)

//响应拦截
network.interceptors.response.use(
  response => {
    if (response.data.status === 401) {
      router.replace('/login').then(() => {
        // Message.warning('登录失效，请重新登录!');
      });
    }
    return response.data
  },
  err => console.log(err)
)

export default network
