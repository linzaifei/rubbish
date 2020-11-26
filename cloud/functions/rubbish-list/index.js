// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'rubbish-dev-6g6di3akcb86269c'
})
// 云函数入口函数
const db = cloud.database();
const $ = db.command.aggregate
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const method = event.method;

  switch(method){
    case 'get':
      return await getRubbishData(event)
      break;
      case 'search':
        return await getRubbishSearch(event)
      break;
      case 'random':
        return await getRandomData(event)
      break;
  }
}

async function getRubbishData(event){
  const type = event.type;
  const page = event.page;
  return await db.collection('rubbish-list').where({
    category:type,
  }).limit(10).skip((page-1)*10).get();

}

async function getRubbishSearch(event){
  const keyword = event.keyword;
  const page = event.page;
  return await db.collection('rubbish-list')
  .where({
    name:db.RegExp({
      regexp: keyword,
      options: 'i',
    })
  }).get()
}

async function getRandomData(event){
  return db.collection('rubbish-list')
  .aggregate().match({
    category:_.neq(16),
  })
  .sample({size:20}).end();
}