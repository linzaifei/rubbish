
import Taro, { Component } from '@tarojs/taro'
// import CloudManager from '@/utils/CloudManager'
import Tools from '@/utils/Tools'


function getScreenWidth() {
    var res = Taro.getSystemInfoSync();
    return res.windowWidth;
}

/** 获取line canvas */
function getLineCanvas(simulationData) {

    return {
        canvasId: 'runLine',
        type: 'line',
        width: getScreenWidth(),
        height: 200,
        categories: simulationData.categories,
        title: '',
        animation: true,
        series: [{
            name: '最近一个月运动数据',
            data: simulationData.data,
            format: function (val) {
                return val + 'm';
            },
            color: '#39b54a'
        }],
        xAxis: {
            disableGrid: true,
        },
        yAxis: {
            title: '运动距离',
            format: function (val) {
                return val.toFixed(2);
            },
            min: 0
        },
        dataLabel: true,
        dataPointShape: true,
        enableScroll: true,
        extra: {
            lineStyle: 'curve'
        }
    }

}


function getPieCanvas(data) {
    return {
        canvasId: 'runPie',
        type: 'pie',
        series: data,
        width: getScreenWidth(),
        height: 250,
        dataLabel: true,
    }
}



// function arrMaxNum2(arr) {
//     return
// }
// function arrMinNum2(arr) {
//     return
// }
// function arrAverageNum2(arr) {
//     var sum = eval(arr.join("+"));
//     return ~~(sum / arr.length * 100) / 100;
// }

/** 获取运动数据统计 */
function getRunDataStatistics(runData) {
    let step_max = 0;
    const arr = runData.map(item => {
        step_max += item.step;
        return item.step;
    })

    let max = Math.max(...arr);
    let min = Math.min(...arr);

    console.log('==', max, min, step_max)


    return [{
        title: '运动总数',
        value: step_max
    }, {
        title: '平均数',
        value: (step_max / arr.length).toFixed(1)
    }, {
        title: '最大步数',
        value: max
    }, {
        title: '最小步数',
        value: min
    },]

}

/** 运动数据的过滤 */
function getFilterData(runData) {
    const len = runData.length;

    let arr1 = runData.filter(item => {
        return item.step > 10000
    })
    let arr2 = runData.filter(item => {
        return (item.step <= 10000 && item.step > 5000)
    })
    let arr3 = runData.filter(item => {
        return (item.step <= 5000 && item.step > 1000)
    })
    let arr4 = runData.filter(item => {
        return item.step <= 1000
    })
    // console.log(arr1.length, arr2.length, arr3.length, arr4.length)
    let p1 = (arr1.length / len).toFixed(2) * 100
    let p2 = (arr2.length / len).toFixed(2) * 100
    let p3 = (arr3.length / len).toFixed(2) * 100
    let p4 = (arr4.length / len).toFixed(2) * 100
    console.log(p1, p2, p3, p4)
    return [{
        name: '10000步以上',
        data: p1
    }, {
        name: '5000-10000步',
        data: p2
    }, {
        name: '1000-5000步',
        data: p3
    }, {
        name: '1000步以下',
        data: p4
    }]
}



/** 获取x轴数据 */
function getLineXData(runData) {
    var categories = [];
    var data = [];
    runData.map((item, index) => {
        categories.push(Tools.formatDate(item.timestamp * 1000))
        data.push(item.step)
    })
    return {
        categories: categories,
        data: data
    }
}

/** 获取运动数据 */
function getRunInfo() {
    const self = this;
    return new Promise((reslove, reject) => {
        Taro.login().then(ret => {
            console.log('登录成功');
            Taro.getWeRunData().then(ret => {
                console.log('运动数据', ret)
                const cloudID = ret.cloudID
                // CloudManager.getRunData(cloudID).then(ret => {
                //     console.log('===', ret.stepInfoList)
                //     reslove(ret.stepInfoList)
                // }).catch(e => {
                //     reject(e)
                // })
            })
        })
    })
}




export default {
    getRunInfo,
    getLineXData,
    getFilterData,
    getLineCanvas,
    getPieCanvas,
    getRunDataStatistics,



}