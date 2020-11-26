import Taro, { Component, requirePlugin } from '@tarojs/taro'
import { View, Text, Button, Input, Image, Form } from '@tarojs/components'
import './index.scss'
import { Dicider } from "../../pkg-answer/answer-result/node_modules/@/components";
import { AtSearchBar } from "taro-ui";
import classNames from 'classnames'
import AppManager from '@/utils/AppManager';
import JsonData from './index.json'


export default class Index extends Component {

  config = {
    navigationBarTitleText: '我的',
    navigationBarBackgroundColor: '#39b54a',
    navigationBarTextStyle: 'white',
    backgroundTextStyle: "light",
    // navigationStyle: 'custom'
  }
  constructor(props) {
    super(props)
    this.state = {
      userInfo: '',
    }
  }



  componentDidMount() {
    if (AppManager.getUserInfoState()) {
      this.setState({
        userInfo: AppManager.getUserData(),
      })
    }
  }

  onClickItem(index) {
    switch (index) {
      case 1:
        Taro.navigateTo({
          url: '/pkg-mine/activity-rules/index'
        })
        break;
      case 2:
        Taro.navigateTo({
          url: '/pkg-mine/rank/index'
        })
        break;
      case 3:
        Taro.navigateTo({
          url: '/pkg-answer/answer-statistics/index'
        })
        break;

    }

  }

  onGetUserInfo(data) {
    const self = this;
    console.log('===', data)
    AppManager.setUserData(data.detail.userInfo)
    self.setState({
      userInfo: data.detail.userInfo
    })
  }
  //title
  getHeader() {
    const {
      userInfo
    } = this.state;
    if (!userInfo) {
      return (
        <View className='flex justify-center align-center  padding-top-xl padding-100' >
          <Button openType='getUserInfo' onGetUserInfo={this.onGetUserInfo.bind(this)} className="cu-btn bg-white">获取个人头像、姓名展示</Button>
        </View >
      )
    }
    return (
      <View className='flex flex-direction justify-center align-center  padding-tb-xl'>
        <Image src={userInfo.avatarUrl} className='container-top-header' />
        <Text className='text-white text-sm margin-top-xs'>{userInfo.nickName}</Text>
      </View >
    )
  }
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '快来使用垃圾分类',
      path: '/pages/index/index',
      imageUrl: require('@/images/share.png')
    }
  }

  getItemView(title, icon, index, type = '') {
    return (
      <View className='cu-item arrow'>
        <Button className="cu-btn content" openType={type} onClick={this.onClickItem.bind(this, index)}>
          <View className="content">
            <Text class={classNames("text-green", 'cuIcon-' + icon)}></Text>
            <Text className="text-grey text-df">{title}</Text>
          </View>
        </Button>
      </View>
    )
  }

  render() {
    const {
      dataArr,
      sum,
    } = this.state;

    const items = JsonData.list.map((item, index) => {
      return (
        this.getItemView(item.title, item.icon, index, item.type)
      )
    })


    return (
      <View className='container'>
        <View className="container-top">
          {this.getHeader()}
          <Image src='https://6661-fatdown-wxapp-sg2p1-1300398887.tcb.qcloud.la/wave.gif?sign=045605c672f482a8c3d428abed669aa7&t=1570674356' mode='scaleToFill' class='gif-wave'></Image>
        </View>

        <View class="cu-list menu card-menu margin-sm shadow-lg radius-sm ">
          {items}
        </View>




      </View>
    )
  }
}
