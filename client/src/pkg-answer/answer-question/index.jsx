import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image, Form } from '@tarojs/components'
import './index.scss'
import { AtSearchBar } from "taro-ui";
import classNames from 'classnames'
import RubbishCloudManager from '@/utils/manager/RubbishCloudManager';
import JsonData from './index.json'
import Tools from '@/utils/Tools';
import AnswerManager from '../AnswerManager';


export default class Index extends Component {

  config = {
    navigationBarTitleText: '分类答题',
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
    RubbishCloudManager.getRubbishQuestion().then(ret => {
      Tools.loading(false)
      console.log('===', ret);
      const list = ret.result.list;
      this.setState({
        dataArr: ret.result.list,
        currentIndex: 0,
        currentData: list[0]
      })
      this.count = 100 / list.length;
      console.log('===count', this.count)
    }).catch(e => {
      Tools.loading(false)
      console.log('====失败')
    })
  }

  onClickItem(type) {
    const {
      currentData,
      currentIndex,
      dataArr,
    } = this.state;
    // console.log('=========', currentData.type, type)
    const x = currentIndex + 1;
    if (this.sorceList.length <= dataArr.length) {
      dataArr[currentIndex].ctype = type;
      this.sorceList.push(parseInt(currentData.type) == type ? this.count : 0);
    }
    if (x >= dataArr.length) {
      const sum = this.sorceList.reduce((x, y) => { return x + y });
      console.log('===sum==', this.sorceList, sum)
      Taro.showModal({
        title: '答题结束',
        content: '当前答题分数：' + sum,
        showCancel: false
      }).then(ret => {
        Taro.navigateTo({
          url: '/pkg-answer/answer-result/index?sum=' + sum + '&type=' + 1 + '&arr=' + JSON.stringify(dataArr),
        })
      })
      return;
    }

    Taro.showToast({
      title: parseInt(currentData.type) == type ? '回答正确' : '答案：' + currentData.typename,
      image: require(parseInt(currentData.type) == type ? '@/images/face/ic_face_xiao.png' : '@/images/face/ic_face_ku.png'),
      duration: 600,
      success: () => {
        console.log('====cheng')
        this.setState({
          currentIndex: x,
          currentData: dataArr[x],
        })
      }
    })
    if (parseInt(currentData.type) != type) { //回答错误保存到错题集中
      AnswerManager.saveAnswerRecord(currentData, 1)
    }
    AnswerManager.addApm(currentData, parseInt(currentData.type) == type, 1)
  }

  render() {
    const {
      currentData,
      currentIndex,
      dataArr,
    } = this.state;
    const items = JsonData.guide.map(item => {
      return (
        <Button className='cu-btn margin-top-lg line-green round' onClick={this.onClickItem.bind(this, item.type)}>{item.name}</Button>
      )
    })
    return (
      <View className='container'>
        <View className='padding-sm margin-sm'>
          <View className='text-xl text-bold '>第{currentIndex + 1}/{dataArr.length}题：下面{currentData.name}是什么垃圾？</View>
          <View className='flex jusity-center margin-top-sm'>
            <Image src={currentData.image} mode='aspectFit' style='width:100%' />
          </View>
          <View className='margin-xl magin-lf-xl padding-lf-lg flex flex-direction'>
            {items}
          </View>
        </View>
      </View>
    )
  }
}
