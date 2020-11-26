import RubbishCloudManager from "../utils/manager/RubbishCloudManager";







//保存错题集
function saveAnswerRecord(data, type) {
    console.log('=====wolai', data)
    let params = {}
    if (type == 0) {
        let key = 0;
        if (data.category == 8) {
            key = 1;
        } else if (data.category == 4) {
            key = 2;
        } else if (data.category == 1) {
            key = 3;
        } else if (data.category == 2) {
            key = 4;
        }
        params = {
            id: data._id,
            name: data.name,
            type: key,
            image: '',
        }
    } else {
        params = {
            id: data._id,
            name: data.name,
            type: parseInt(data.type),
            image: data.image,
        }
    }
    return RubbishCloudManager.addRubbishRecord(params)
}
function delAnswerRecord(data) {
    return RubbishCloudManager.delRubbishRecord(data._id);
}
function addApm(data, grade, type) {
    console.log('=====', data)

    const params = {
        id: data._id,
        grade,
        type,
    }
    console.log('====params=', params)
    return RubbishCloudManager.addApm(params)
}

function getApm() {
    return RubbishCloudManager.getApm()
}
function getApmBank() {
    return RubbishCloudManager.getApmBank()
}
export default {
    saveAnswerRecord,
    delAnswerRecord,
    addApm,
    getApm,
    getApmBank
}