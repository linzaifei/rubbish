import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image, Form } from '@tarojs/components'
import './index.scss'

import { AtSearchBar } from "taro-ui";
import classNames from 'classnames'
import RubbishCloudManager from '@/utils/manager/RubbishCloudManager';
import RequestManager from '@/utils/manager/RequestManager';
import Tools from '@/utils/Tools';
import AppManager from '@/utils/AppManager';
import JsonData from '../answer-question/index.json'
import AnswerManager from '../AnswerManager';


export default class Index extends Component {

  config = {
    navigationBarTitleText: '错题集',
  }

  constructor(props) {
    super(props)
    this.count = 10;
    this.sorceList = []
    this.state = {
      dataArr: [],
      currentIndex: 0,
      currentData: {},
    }
  }



  componentDidMount() {
    this.loadData()
  }
  loadData() {
    Tools.loading(true)
    RubbishCloudManager.getRubbishRecord().then(ret => {
      Tools.loading(false)
      console.log('===', ret)
      const list = ret.result.data;
      this.setState({
        dataArr: list,
        currentIndex: 0,
        currentData: list[0]
      })
      this.count = 100 / list.length;
      console.log('===count', this.count)
    }).catch(e => {
      Tools.loading(false)
    })

  }

  onClick(type) {
    const self = this;
    const {
      currentData,
      currentIndex,
      dataArr,
    } = self.state;
    const isCheck = currentData.type == type;
    const x = currentIndex + 1;
    if (this.sorceList.length <= dataArr.length) {
      this.sorceList.push(isCheck ? this.count : 0);
      if (isCheck) { //回答错误保存到错题集中
        AnswerManager.delAnswerRecord(currentData)
      }
    }
    if (x >= dataArr.length) {
      const sum = this.sorceList.filter(item => { return item > 0 });
      Taro.showModal({
        title: '答题结束',
        content: '这次答题答对了：' + sum.length + '题',
        showCancel: false
      }).then(ret => {
        Taro.navigateBack({
          delta: 1
        })
      })
      return;
    }
    Taro.showToast({
      title: isCheck ? '回答正确' : '答案：' + JsonData.answer[currentData.type],
      image: require(isCheck ? '@/images/face/ic_face_xiao.png' : '@/images/face/ic_face_ku.png'),
      duration: 600,
      success: () => {
        console.log('====cheng')
        this.setState({
          currentIndex: x,
          currentData: dataArr[x],
        })
      }
    })

  }
  onClickItem() {
    Taro.navigateTo({
      url: '/pkg-answer/answer-list/index'
    })
  }


  render() {
    const {
      currentData,
      currentIndex,
      dataArr,
    } = this.state;

    if (dataArr.length == 0) {
      return (
        <View className='flex flex-direction align-center justify-center' style='height:100vh'>
          <Image src={require('@/images/ic_null.png')} mode='widthFix' style='width:300rpx' />
          <View className='text-df margin-top-sm'>暂时没有错误哦！你可以先去<Text className='text-green' onClick={this.onClickItem.bind(this)}>答题</Text></View>
        </View>
      )
    }
    const items = JsonData.guide.map(item => {
      return (
        <Button className='cu-btn margin-top-lg line-green round' onClick={this.onClick.bind(this, item.type)}>{item.name}</Button>
      )
    })
    return (
      <View className='container'>
        <View className='padding-sm margin-sm'>
          <View className='text-xl text-bold '>第{currentIndex + 1}/{dataArr.length}题：{currentData.image ? '下面' : ''}{currentData.name}是什么垃圾？</View>
          {
            currentData.image ?
              <View className='flex jusity-center margin-top-sm'>
                <Image src={currentData.image} mode='aspectFit' style='width:100%' />
              </View> : null
          }

          <View className='margin-xl magin-lf-xl padding-lf-lg flex flex-direction'>
            {items}
          </View>
        </View>
      </View>
    )
  }
}
