import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const state = {
    token: "",
    userInfo: {},
    shopInfo:{},
    clientHeight:"",
    tableHeight2:"",
    tableHeight3:"",
    mainHeight:"",
    tableHeight:""
}

const mutations={
    setToken(state, token) {
        state.token = token;
    },
    setUserInfo(state, data) {
        state.userInfo = data;
        sessionStorage.setItem("userInfo", JSON.stringify(data));
    },
    setshopInfo(state, data) {
        state.shopInfo = data;
        sessionStorage.setItem("shopInfo", JSON.stringify(data));
    },
    setClientHeight(state, height) {
        state.clientHeight = height;
        sessionStorage.setItem("clientHeight", height);
    },
    setMainHeight(state, height){
        state.mainHeight = height;
        sessionStorage.setItem("mainHeight", height);
    },
    setTableHeight(state,height){
        state.tableHeight = height;
        sessionStorage.setItem("tableHeight", height);
    },
    setTableHeight2(state, height) {
        state.tableHeight2 = height;
        sessionStorage.setItem("tableHeight2", height);
    },
    setTableHeight3(state, height) {
        state.tableHeight3 = height;
        sessionStorage.setItem("tableHeight3", height);
    }
}

export default new Vuex.Store({
    state,
    mutations
})