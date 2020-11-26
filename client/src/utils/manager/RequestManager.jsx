import Taro from '@tarojs/taro'




/*** 上传单张 */
function upload(url, path, params = {}) {
    return Taro.uploadFile({
        url: url,
        filePath: path,
        name: 'file',
        formData: params,
        header: {
            'content-type': 'application/json;application/x-www-form-urlencoded'
        },

    })
}

/** Request */
function request(url, params) {
    return Taro.request({
        url: url,
        data: params,
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
    })
}

/** Request */
function post(url, params) {
    return Taro.request({
        url: url,
        data: params,
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
    })
}

export default {
    upload,
    post,
    request,
}



