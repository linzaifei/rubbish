import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image, Form } from '@tarojs/components'
import './index.scss'

import { AtSearchBar } from "taro-ui";
import classNames from 'classnames'
import RubbishCloudManager from '@/utils/manager/RubbishCloudManager';
import RequestManager from '@/utils/manager/RequestManager';
import Tools from '@/utils/Tools';
import AppManager from '@/utils/AppManager';



export default class Index extends Component {

  config = {
    navigationBarTitleText: '答题小课堂',
  }

  constructor(props) {
    super(props)
    this.index = 0;
    this.state = {
      dataArr: [],
      openType: 'getUserInfo',
    }
  }



  componentDidMount() {
    this.setState({
      openType: AppManager.getUserInfoState() ? '' : 'getUserInfo'
    })
  }


  onClickItem(idx) {
    if (AppManager.getUserInfoState()) {
      Taro.navigateTo({
        url: idx == 0 ? '/pkg-answer/answer/index' : '/pkg-answer/answer-question/index'
      })
    }
    this.index = idx
  }

  onGetUserInfo(ret) {
    if (ret.detail.userInfo) {
      AppManager.setUserData(ret.detail.userInfo)
      this.setState({
        openType: ''
      })
      Taro.navigateTo({
        url: this.index == 0 ? '/pkg-answer/answer/index' : '/pkg-answer/answer-question/index'
      })
    }
  }



  render() {
    const {
      openType,
    } = this.state;

    return (
      <View className='container'>
        <Button openType={openType} className='margin-sm bg-white' onClick={this.onClickItem.bind(this, 0)} onGetUserInfo={this.onGetUserInfo.bind(this)} >
          <View>
            <Image src='cloud://rubbish-dev-6g6di3akcb86269c.7275-rubbish-dev-6g6di3akcb86269c-1304022726/banner/banner2.png' mode='widthFix' style='width:100%' />
            <Text className='margin-top-sm'>垃圾分类随机测试库1</Text>
          </View>
        </Button>

        <Button openType={openType} onClick={this.onClickItem.bind(this, 1)} onGetUserInfo={this.onGetUserInfo.bind(this)} className='margin-lr-sm margin-top-xl bg-white'>
          <View>
            <Image src='cloud://rubbish-dev-6g6di3akcb86269c.7275-rubbish-dev-6g6di3akcb86269c-1304022726/banner/banner2.png' mode='widthFix' style='width:100%' />
            <Text className='margin-top-sm'>垃圾分类随机测试库2</Text>
          </View>
        </Button>
      </View>
    )
  }
}
