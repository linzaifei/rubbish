// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'rubbish-dev-6g6di3akcb86269c'
})
// 云函数入口函数
const db = cloud.database();
const $ = db.command.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()


  const method = event.method;

  switch(method){
    case 'get':
      return await getRubbishData(event)
      break;
      case 'add':
        return await addRubbish(event)
      break;
      case 'random':
        return await getRandomData(event)
      break;
  }
  

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}


async function addRubbish(event){
  const data = event.data;
  return db.collection('rubbish-question').add({
    data:data,
  })
}

async function getRandomData(event){
  return await db.collection('rubbish-question')
  .aggregate()
  .sample({size:20}).end();
}