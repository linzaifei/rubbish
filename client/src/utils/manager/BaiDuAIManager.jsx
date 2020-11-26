
import Taro from '@tarojs/taro'
import Tools from '../Tools'
import RequestManager from './RequestManager'
const token = 'https://aip.baidubce.com/oauth/2.0/token'
const URL = 'https://aip.baidubce.com/rest/2.0/image-classify/v2/advanced_general'
const VOPURL = 'https://vop.baidu.com/pro_api'
const grant_type = 'client_credentials'
const client_id = '3NOwqWpUsYTKqA4goySHRlYs'
const client_secret = 'uscTP4fAkN4cOGTYHNe3eiRPv3ay25UH'


function getToken() {
    const params = {
        grant_type,
        client_id,
        client_secret,
    }
    console.log('====', params)
    return RequestManager.request(token, params)
}


function getImageData(tempImagePath) {
    return new Promise((reslove, reject) => {
        Tools.loading(true)
        Taro.getFileSystemManager().readFile({
            filePath: tempImagePath,
            encoding: "base64",
            success: res => {
                Tools.loading(false)
                console.log('==res', res.data)
                reslove(res.data)
            }, fail: e => {
                console.log('====', e)
                reject(e)
                Tools.loading(false)
            }
        })
    })
}




function ai(token, image) {
    var that = this
    var data = {
        "image": image
    }
    const url = URL + '?access_token=' + token;
    return new Promise((reslove, reject) => {
        Tools.loading(true)
        RequestManager.request(url, data).then(ret => {
            Tools.loading(false)
            const results = ret.data.result;
            console.log('results===', ret)
            reslove(results)
        }).catch(e => {
            Tools.loading(false)
            console.log('e===', e)
            reject(e)
        })
    })
}

function vop(params) {
    var that = this
    return new Promise((reslove, reject) => {
        Tools.loading(true)
        RequestManager.post(VOPURL, params).then(ret => {
            Tools.loading(false)
            const results = ret.data.result;
            console.log('results===', ret)
            reslove(results)
        }).catch(e => {
            Tools.loading(false)
            console.log('e===', e)
            reject(e)
        })
    })

}


//语音识别
function recogntionVop(res) {

    const fileSize = res.fileSize;
    const tempFilePath = res.tempFilePath;
    console.log('=====res', fileSize, tempFilePath)
    // let format = 'pcm';
    // if (tempFilePath) {
    //     format = tempFilePath.substring(tempFilePath.lastIndexOf('.') + 1);
    // }
    return new Promise((reslove, reject) => {
        getImageData(tempFilePath).then(base64 => {
            const token = '24.a6a771b8ab55f2d10ae9d50ef1222209.2592000.1608878416.282335-22889465'
            const data = {
                "format": 'aac',
                "rate": 16000,
                "dev_pid": 80001,
                "channel": 1,
                "token": token,
                "cuid": "baidu_workshop",
                "len": fileSize,
                "speech": base64
            }
            console.log('语音识别请求参数：', data);

            vop(data).then(ret => reslove(ret)).catch(e => reject(e))
        }).catch(e => {
            reject(e)
            console.log('====', e);
        })
    })


}
//图片识别
function recogntionPictrue(tempImagePath) {
    return new Promise((reslove, reject) => {
        getImageData(tempImagePath).then(data => {
            // const t = '24.a6a771b8ab55f2d10ae9d50ef1222209.2592000.1608878416.282335-22889465'
            getToken().then(ret => {
                console.log('====', ret.data.access_token)
                ai(ret.data.access_token, data).then(ret => reslove(ret)).catch(e => reject(e))
            }).catch(e => {
                reject(e)
                console.log('===', e)
            })
        }).catch(e => {
            reject(e)
            console.log('====', e);
        })
    })
}


export default {
    getImageData,
    ai,
    getToken,
    recogntionVop,
    recogntionPictrue,

}