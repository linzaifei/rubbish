import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image, Form, ScrollView } from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import Tools from '@/utils/Tools';
import JsonData from '@/pages/index/index.json'
import RubbishCloudManager from '@/utils/manager/RubbishCloudManager';
import AppManager from '@/utils/AppManager';

import OtherJson from '../answer-question/index.json'



export default class Index extends Component {

  config = {
    navigationBarTitleText: '答题结果',
  }
  constructor(props) {
    super(props)

    this.state = {
      dataArr: [{ _id: "c497f5885f963787009e154d4371af4f", name: "茨菇", category: 4, ctype: 1 },
      { _id: "c497f5885f963787009e13bd75d3d206", name: "雨靴", category: 1, ctype: 1 },
      { _id: "c497f5885f963787009e19b74fa570be", name: "过滤网", category: 1, ctype: 1 },
      { _id: "c497f5885f963787009e1a7d2940f65c", name: "鞋带", category: 1, ctype: 1 },
      { _id: "c497f5885f963787009e19ff5f09a20e", name: "纸箱", category: 1, ctype: 1 },
      { _id: "c497f5885f963787009e1b3531988b3d", name: "汽车模型", category: 1, ctype: 1 },
      { _id: "c497f5885f963787009e1ccb5aaca994", name: "羊肉", category: 4, ctype: 1 },
      { _id: "c497f5885f963787009e12c06e0d78e8", name: "素菜", category: 4, ctype: 1 }],
      sum: 0,
      type: 0,//表示不同的答题风格 
    }
  }



  componentDidMount() {

    const params = this.$router.params;
    this.setState({
      sum: params.sum,
      dataArr: JSON.parse(params.arr),
      type: params.type,
    }, () => {
      this.uploadScore()
    })


  }

  uploadScore() {
    const {
      sum,
      type,
    } = this.state;
    const userInfo = AppManager.getUserData();
    const params = {
      name: userInfo.nickName,
      score: sum,
      type: parseInt(type),
      avatarUrl: userInfo.avatarUrl,
    }

    console.log('====params', params)
    RubbishCloudManager.addRubbishRank(params).then(ret => {
      console.log('===上传成功')
    }).catch(e => {
      console.log('===上传失败')
    })

  }




  onClickItem(idx) {
    switch (idx) {
      case 0:

        break;
      case 1:
        Taro.navigateBack({
          delta: 3,
        })
        break;
    }
  }
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    const msg = '我在垃圾分类答题中获得：' + this.state.sum + '分'
    return {
      title: msg,
      path: '/pages/answer/index',
      // imageUrl: require('@/images/share.png')
    }
  }

  render() {
    const {
      dataArr,
      sum,
      type,
    } = this.state;

    const items = dataArr && dataArr.map(item => {
      let realName = '';
      let cName = '';
      if (type == 0) {
        realName = JsonData.answer[item.category + ''] ? JsonData.answer[item.category + ''] : '';
        cName = item.category != item.ctype ? JsonData.answer[item.ctype] : '';
      } else {
        realName = OtherJson.answer[item.type];
        cName = parseInt(item.type) != item.ctype ? OtherJson.answer[item.ctype + ''] : '';
      }
      return (
        <View className={classNames('text-df padding-sm ',)}>
          {item.name}-<Text className='text-green'>{realName}</Text>
          {
            cName ?
              <Text className='text-red'>-{cName}</Text> : null
          }
        </View >
      )
    })
    return (
      <View className='container' >
        <View className='margin-sm padding-sm  radius-sm bg-white'>
          <View className='text-sm'>当前得分</View>
          <View className='text-bold text-center margin-xl' style='font-size:80px'>
            {sum}
          </View>
        </View>
        <View className='margin-sm padding-sm radius-sm bg-white'>
          <View className='text-sm'>答案列表(绿色表示正确答案，红色表示该题选择错误答案)</View>
          <View className='margin-top-xs'>
            <ScrollView scrollY style='max-height:600rpx'>
              {items}
            </ScrollView>
          </View>
        </View>

        <View className='margin-sm padding-sm radius-sm bg-white'>
          <View className='text-sm'>分享</View>
          <View className='flex flex-direction padding-sm margin-lr-xl '>
            <Button className='cu-btn bg-green' openType='share' onClick={this.onClickItem.bind(this, 0)}><Text className='cuIcon-share' style='font-size:30rpx'>分享</Text></Button>
            <Button className='cu-btn line-green margin-top-sm' onClick={this.onClickItem.bind(this, 1)}><Text className='cuIcon-home' style='font-size:30rpx'>返回首页</Text></Button>
          </View>
        </View>
      </View>
    )
  }
}
