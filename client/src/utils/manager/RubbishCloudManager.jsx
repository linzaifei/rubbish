import Taro from '@tarojs/taro'


function getRubbishNote(type) {
    return Taro.cloud.callFunction({
        name: 'rubbish-note',
        data: {
            type: parseInt(type),
        }
    })
}

function getRubbishList(type, page) {
    return Taro.cloud.callFunction({
        name: 'rubbish-list',
        data: {
            type: parseInt(type),
            page: page,
            method: 'get'
        }
    })
}
function getSearchRubbish(params) {
    return Taro.cloud.callFunction({
        name: 'rubbish-list',
        data: {
            page: params.page,
            keyword: params.keyword,
            method: 'search'
        }
    })
}
function getRubbishRandom(type) {
    return Taro.cloud.callFunction({
        name: 'rubbish-list',
        data: {
            type: parseInt(type),
            method: 'random'
        }
    })
}
function getRubbishSchool(type) {
    return Taro.cloud.callFunction({
        name: 'rubbish-school',
        data: {

        }
    })
}

//排名
function getRubbishRank(type = 0) {
    return Taro.cloud.callFunction({
        name: 'rubbish-rank',
        data: {
            method: 'get',
            type,
        }
    })
}
function addRubbishRank(data) {
    return Taro.cloud.callFunction({
        name: 'rubbish-rank',
        data: {
            data,
            method: 'add'
        }
    })
}
function updateRubbishRank(data) {
    return Taro.cloud.callFunction({
        name: 'rubbish-rank',
        data: {
            data,
            method: 'update'
        }
    })
}
function getRubbishRankMine(type) {
    return Taro.cloud.callFunction({
        name: 'rubbish-rank',
        data: {
            method: 'mine',
            type,
        }
    })
}




//Text-------
function addRubbishQuestion(data) {
    return Taro.cloud.callFunction({
        name: 'rubbish-question',
        data: {
            data,
            method: 'add'
        }
    })
}
function getRubbishQuestion(data) {
    return Taro.cloud.callFunction({
        name: 'rubbish-question',
        data: {
            data,
            method: 'random'
        }
    })
}


//错题集
function getRubbishRecord() {
    return Taro.cloud.callFunction({
        name: 'rubbish-record',
        data: {
            method: 'get'
        }
    })
}
function addRubbishRecord(data) {
    return Taro.cloud.callFunction({
        name: 'rubbish-record',
        data: {
            method: 'add',
            data,
        }
    })
}
function delRubbishRecord(id) {
    return Taro.cloud.callFunction({
        name: 'rubbish-record',
        data: {
            method: 'delete',
            id,
        }
    })
}

function addApm(data) {
    return Taro.cloud.callFunction({
        name: 'rubbish-apm',
        data: {
            method: 'add',
            data,
        }
    })
}


function getApm() {
    return Taro.cloud.callFunction({
        name: 'rubbish-apm',
        data: {
            method: 'get',
        }
    })
}
function getApmBank() {
    return Taro.cloud.callFunction({
        name: 'rubbish-apm',
        data: {
            method: 'getbank',
        }
    })
}



export default {
    getRubbishNote,
    getRubbishList,
    getSearchRubbish,
    getRubbishSchool,
    getRubbishRandom,
    getRubbishRank,
    addRubbishRank,
    updateRubbishRank,
    addRubbishQuestion,
    getRubbishQuestion,
    getRubbishRecord,
    delRubbishRecord,
    addRubbishRecord,
    addApm,
    getApm,
    getApmBank,
    getRubbishRankMine,
}