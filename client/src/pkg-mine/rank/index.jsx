import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image, Form, ScrollView, } from '@tarojs/components'
import './index.scss'
import { AtFab } from "taro-ui";
import classNames from 'classnames'
import AppManager from '@/utils/AppManager';
import JsonData from './index.json'
import RubbishCloudManager from '@/utils/manager/RubbishCloudManager';
import Tools from '@/utils/Tools';


export default class Index extends Component {

  config = {
    navigationBarTitleText: '挑战排名',
  }
  constructor(props) {
    super(props)
    this.state = {
      dataArr: [],
      currentIndex: 0,
    }
  }



  componentDidMount() {

    this.loadData()
  }

  loadData() {
    const {
      currentIndex
    } = this.state;
    Tools.loading(true)
    RubbishCloudManager.getRubbishRank(currentIndex).then(ret => {
      console.log(ret)
      Tools.loading(false)
      this.setState({
        dataArr: ret.result.list,
      })
    }).catch(e => {
      Tools.loading(false)
    })
  }

  onClick(idx) {
    const {
      currentIndex,
    } = this.state

    if (currentIndex == idx) return;
    this.setState({
      currentIndex: idx
    }, () => {
      this.loadData()
    })
  }

  onGetUserInfo(data) {
    const {
      currentIndex,
    } = this.state
    AppManager.setUserData(data.detail.userInfo)
    Taro.navigateTo({
      url: '/pkg-mine/poster/index?type=' + currentIndex
    })
  }


  render() {
    const {
      dataArr,
      currentIndex,
    } = this.state;

    const items = dataArr && dataArr.map((item, index) => {
      return (
        <View key={item.name} className='padding-sm flex align-center border-bottom-1' >
          <Text className='text-xl'>{index + 1}、</Text>
          <Image src={item.avatarUrl} style='width:80rpx;height:80rpx' mode='aspectFill' className='round' />
          <Text className='text-df margin-left-sm '>{item.name}</Text>
          <Text className='text-df margin-left-sm '> 最高分数：{item.score}</Text>
        </View>
      )
    })
    return (
      <View className='container '>
        <ScrollView class="bg-white nav text-center">
          <View class="cu-item {{currentIndex==0?'text-green cur':''}}" onClick={this.onClick.bind(this, 0)}>
            答题一
          </View>
          <View class="cu-item {{currentIndex==1?'text-green cur':''}}" onClick={this.onClick.bind(this, 1)}>
            答题二
          </View>
        </ScrollView>
        <View className='bg-white radius-sm padding-sm margin-top-xl margin-lr-sm'>
          <View className='text-df'>垃圾分类答题排行版：</View>
          <View className='margin-top-sm'>
            <ScrollView scrollY style='height:900rpx'>
              {items}
            </ScrollView>
          </View>
        </View>


        <View className='flex margin-sm  flex-direction'>
          <Button openType='getUserInfo' onGetUserInfo={this.onGetUserInfo.bind(this)} className='cu-btn bg-green df'>生成海报</Button>
        </View>
      </View >
    )
  }
}
