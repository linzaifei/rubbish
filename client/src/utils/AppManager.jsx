import Taro, { Component, Config } from '@tarojs/taro'

import StoreManager from '@/utils/manager/StoreManager';
import { THEME_STYLE } from '@/utils/manager/ThemeManager';
import WeatherCloudManager from './manager/WeatherCloudManager';
import EventManager from './manager/EventManager';

/**
 * 
 * 主要用于小程序 登录获取用户信息类
 * 
 * 
*/

let userInfo;

/** 初始化云登录 */
function initCloud() {
    if (process.env.TARO_ENV === 'weapp') {
        console.log('初始化');
        if (!Taro.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            console.log('==登录云函数')
            Taro.cloud.init({
                env: 'rubbish-dev-6g6di3akcb86269c',
                traceUser: true,
            })
        }
    }
}

/** 获取用户信息app全局 */
function getUserInfo() {
    return new Promise((reslove, reject) => {
        getAuth('scope.userInfo').then(ret => {
            Taro.getUserInfo().then(ret => {
                console.log('获取userinfo', ret.userInfo)
                reslove(ret.userInfo)
            }).catch(e => reject(e))
        }).catch(e => {
            reject(e)
        })
    })
}

function getAuth(key) {
    return new Promise((reslove, reject) => {
        Taro.getSetting().then((ret) => {
            console.log('获取授权', ret)
            if (ret.authSetting[key]) {
                reslove(ret)
            } else {
                reject(ret)
            }
        })
    })
}

/** 获取用户信息状态 */
function getUserInfoState() {
    return userInfo ? true : false;
}
/** 获取用户信息 */
function getUserData() {
    return userInfo;
}
function setUserData(data) {
    userInfo = data;
}


/** app登录 */
function appLogin() {
    const self = this;
    Taro.login().then((ret) => {
        console.log('登录成功', ret)
    })
}

/** 开始 */
function start() {
    initCloud();
    appLogin();
    checkUpdate()
    getUserInfo().then(ret => {
        setUserData(ret)
    })
}

// 检查新版本
function checkUpdate() {
    const updateManager = Taro.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
        Taro.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
                if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                }
            }
        })
    })
    updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
    })
}



export default {
    start,
    initCloud,
    appLogin,
    getUserInfo,
    getUserInfoState,
    getUserData,
    setUserData,
    getAuth,

}