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

  switch(method){
    case 'get':
      return await getRubbishRank(event)
      break;
      case 'add':
        return await onAdd(event)
      break;
      case 'update':
        return await onUpdate(event)
      break;
      case 'mine':
        return await getRubbishMine(event)
      break;
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}

//获取排名
async function getRubbishMine(event){
  const type = event.type;
  const wxContext = cloud.getWXContext()
  return await db.collection('rubbish-rank')
  .aggregate()
  .match({
    type:type,
    openid:wxContext.OPENID,
  }) 
  .end()
}


//获取排名
async function getRubbishRank(event){
  const type = event.type;
  return await db.collection('rubbish-rank')
  .aggregate()
  .match({
    type:type
  })
  .sort({
      score: -1,
  }).limit(50)
  .end()
}

//添加排名
async function onAdd(event){
  const data = event.data;
  const wxContext = cloud.getWXContext()
  const res = await  db.collection('rubbish-rank').where({
    openid:wxContext.OPENID,
    type:data.type,
  }).get();

  //存储每次运行的数据
  cloud.callFunction({
    name:'rubbish-record',
    data:{
      method:'add',
      data:{
        ...data,
        openid:wxContext.OPENID,
        createTime: db.serverDate()
      },
    }
  })

  if(res.data.length==0){
    return await db.collection('rubbish-rank').add({
      data:{
      ...data,
      openid:wxContext.OPENID,
      createTime: db.serverDate()
      }
    })
  }else{
    //判断分数高低
    const scroe = res.data[0].score;
    const in_score = data.score;
    if(in_score>scroe){
        return await onUpdate(event)
    }
    return{
      msg:"没有库里大 不更新"
    }
  }

  



 

}

//更新排名
async function onUpdate(event){
  const data = event.data;
  const wxContext = cloud.getWXContext()
  return await db.collection('rubbish-rank').where({
      openid:wxContext.OPENID,
      type:data.type,
  }).update({
    data:{
      score:data.score,
    }
  })
}