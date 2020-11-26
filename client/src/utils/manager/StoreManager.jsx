import Taro from '@tarojs/taro'

/**
 *
 *  用户数据存储
 *  LOGIN_DATA：登录信息
 *
 */
export const STORE_KEY = {
    HISTORY: 'HISTORY',//主题KEY

}

/** 保存-获取地理位置*/
function getHistoryList() {
    let s = decodeURIComponent(getStorageSync(STORE_KEY.HISTORY))
    console.log('====s=', s)
    if (s) {
        const value = JSON.parse(s);
        return value;
    }
    return []

}
function setHistoryList(value) {
    value = encodeURIComponent(JSON.stringify(value));
    setStorageSync(STORE_KEY.HISTORY, value)
}








/**  更加 STORE_KEY  获取对象*/
function getStorageSync(key) {
    return Taro.getStorageSync(key);
}

/**  更加 STORE_KEY  获取对象*/
function setStorageSync(key, Value) {
    Taro.setStorageSync(key, Value)
}

/**  更加 STORE_KEY  删除对应存储对象*/
function removeStorageSync(key) {
    Taro.removeStorageSync(key)
}

/**  删除所有存储对象*/
function clearStorageSync() {
    Taro.clearStorage()
}

export default {
    setStorageSync,
    getStorageSync,
    clearStorageSync,
    removeStorageSync,

    getHistoryList,
    setHistoryList,
}
