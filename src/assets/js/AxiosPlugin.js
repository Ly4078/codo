require("es6-promise").polyfill();
import axios from "axios";
import qs from 'qs'
import { Message } from "element-ui";
import router from "./../../router";

var _this = this,errnum=1;
export const Axios = axios.create({
  // baseURL: 'https://vp.byn-kj.com/admin/', //生产
  // baseURL:'http://dev.byn-kj.com/admin/', //测试 
  baseURL: "/api/", //开发
  // timeout: 10000
});

//POST传参序列化(添加请求拦截器)
// 在发送请求之前做某件事
Axios.interceptors.request.use(
  config => {
    // 设置以 form 表单的形式提交参数，如果以 JSON 的形式提交表单，可忽略
    const _strs =config.url;
    if(_strs.indexOf("login") > -1 ){
      config.data=(qs.stringify(config.data))
      config.headers = {
        "Content-Type": 'application/x-www-form-urlencoded'
      };
    }else if (config.method === "post" || config.method === "put") {
      config.headers = {
        "Content-Type": "application/json"
      };
    } else {    
      config.headers = {
        "Content-Type": "application/json;charset=UTF-8"
      };
    }
    if (localStorage.getItem("TOKEN")) {
      config.headers.Authorization = localStorage.getItem("TOKEN");
    }
    return config;
  },
  error => {
    alert("错误的传参", "fail");
    return Promise.reject(error);
  }
);

//返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    //对响应数据做些事
    if (res.status == 200) {
      return res;
    }
  },
  error => {
    if(errnum==1){
      errnum=2;
      setTimeout(() => {
        errnum=1;
      }, 500);
    }
    
    if (error.response.status === 401){
      Message({
        duration: 5000,
        showClose: true,
        message: "请重新登录",
        type: "error"
      });
      router.push({
        name: "Login"
      });
    }else if (error.response.status === 403) {
      Message({
        duration: 5000,
        showClose: true,
        message: error.response.data,
        type: "error"
      });
      router.push({
        name: "Login"
      });
    }else if (error.response.status === 404) {
      router.push({
        name: "Login"
      });
    } else if (error.response.status === 400) {
      Message({
        duration: 5000,
        showClose: true,
        message: error.response.data,
        type: "error"
      });
    } else if (error.response.status === 500) {
      Message({
        duration: 5000,
        showClose: true,
        message: "系统异常，稍后重试",
        type: "error"
      });
      // Promise.reject("系统异常，稍后重试");
    }  if (error.response.status === 502 || error.response.status === 503 || error.response.status === 504) {
      Message({
        duration: 5000,
        showClose: true,
        message: "系统正在维护中",
        type: "error"
      });
      router.push({
        name: "Login"
      });
    } else {
      // Message({
      //   duration: 5000,
      //   showClose: true,
      //   message: error.response.data,
      //   type: "error"
      // });
      return error;
    }
  }
);

export default {
  install(Vue) {
    Object.defineProperty(Vue.prototype, "$http", { value: Axios });
  }
};


