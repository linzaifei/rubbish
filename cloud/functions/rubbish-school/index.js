// 云函数入口文件
const cloud = require('wx-server-sdk')



cloud.init({
  env: 'rubbish-dev-6g6di3akcb86269c'
})
// 云函数入口函数
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return await db.collection('rubbish-school').get();
}