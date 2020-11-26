import Taro from '@tarojs/taro'

function getStrByParams(params) {
    let index = 0;
    let urlStr = '';
    for (var item in params) {
        if (index == 0) {
            urlStr += '?' + item + '=' + params[item]
        } else {
            urlStr += '&' + item + '=' + params[item]
        }
        index++
    }
    return urlStr;
}
function loading(val) {
    if (val) {
        Taro.showLoading({
            title: '加载中'
        })
    } else {
        Taro.hideLoading()
    }
}

function groupBy(arr, key) {
    let groups = {}
    arr.map(item => {
        const group = JSON.stringify(item[key]);
        groups[group] = groups[group] || [];
        groups[group].push(item);
    })
    return groups;
}
export default {
    getStrByParams,
    loading,
    groupBy,
}