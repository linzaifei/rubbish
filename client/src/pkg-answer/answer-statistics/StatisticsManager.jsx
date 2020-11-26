import Tools from "../../utils/Tools"


//题库一  题库二 每天 分布柱形图
function getQuestionBank(list) {
    const categories = [];
    const answer1 = []
    const answer2 = []
    list.map(item => {
        categories.push(item._id);
        const answer_count1 = item.ids.filter(item1 => { return item1 == 0 }).length;
        const answer_count2 = item.ids.length - answer_count1;
        console.log('====', answer_count1, answer_count2)
        answer1.push(answer_count1)
        answer2.push(answer_count2)
    })

    const series = [{
        name: '题库1',
        data: answer1,
    }, {
        name: '题库2',
        data: answer2,
    }]

    return {
        categories,
        series,
    }
}

//题库一 题库二 总量 答题比例
function getAnswerRatio(list) {
    let series
    let series1
    list.map(item => {
        const count = item.ids.filter(it => { return it.grade }).length;
        const arr = [{
            name: '成功数' + count,
            data: count,
        }, {
            name: '失败数' + (item.num - count),
            data: item.num - count,
        }]
        if (item._id == 0) {
            series = arr
        } else {
            series1 = arr
        }
    })
    console.log('=series====', series, series1)
    return {
        series,
        series1,
    }
}

//题库一或者题库二 对错比例
function getQuestionBankRatio(list, type) {

}

//题库一 或者 题库二 每天对错 分布柱形图
// function get






export default {
    getAnswerRatio,
    getQuestionBank,
}