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
  const method = event.method;
  
  //错题集
  switch(method){
      case 'add':
        return await onAdd(event)
      break;
      case 'delete':
        return await onDel(event)
      break;
      case 'get':
        return await onGet(event)
      break;
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

async function onGet(event){
  const wxContext = cloud.getWXContext()
  return await db.collection('rubbish-record').where({
    openid:wxContext.OPENID,
  }).get()
}
async function onAdd(event){
  const data = event.data;
  const wxContext = cloud.getWXContext()
  const ret = await db.collection('rubbish-record').where({
    openid:wxContext.OPENID,
    id:data.id,
  }).count();
  if(ret.total==0){
    return await db.collection('rubbish-record').add({
      data:{
        openid:wxContext.OPENID,
        createTime: db.serverDate(),
        ...data,
      }
    })
  }
}
async function onDel(event){
  const id = event.id;
  const wxContext = cloud.getWXContext()
  const ret = await db.collection('rubbish-record').where({
    openid:wxContext.OPENID,
    _id:id,
  }).count();
  if(ret.total>0){
    return await db.collection('rubbish-record').where({
      openid:wxContext.OPENID,
    _id:id,
    }).remove()
  }
  
}
