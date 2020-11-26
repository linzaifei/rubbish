import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image } from '@tarojs/components'
import './index.scss'
import { AtSearchBar } from "taro-ui";
import JsonData from './index.json'
import classNames from 'classnames'
import BaiDuAIManager from '@/utils/manager/BaiDuAIManager';


export default class Index extends Component {

  config = {
    navigationBarTitleText: '拍照识别',

  }

  constructor(props) {
    super(props)
    this.state = {
      dataArr: [],
      path: "",
    }
  }
  componentDidMount() {
    const path = this.$router.params.path;
    console.log(path)
    this.setState({
      path,
    }, () => {
      this.loadData()
    })

  }
  // score: 0.881931
  // root: "植物-其它"
  // keyword: "玫瑰花"
  loadData() {
    const {
      path,
    } = this.state;
    BaiDuAIManager.recogntionPictrue(path).then(ret => {
      console.log('===ret==', ret)
      this.setState({
        dataArr: ret
      })
    }).catch(e => {
      console.log('====', e)
    })

  }

  onClickItem(item) {
    Taro.navigateTo({
      url: '/pages/search/index?keyword=' + item.keyword
    })
  }
  onClick() {
    Taro.navigateTo({
      url: '/pages/search/index'
    })
  }

  render() {
    const {
      dataArr,
      path,
    } = this.state;

    const items = dataArr && dataArr.map(item => {
      return (
        <View className='cu-item text-lg' onClick={this.onClickItem.bind(this, item)}>
          {item.keyword}
        </View>
      )
    })
    return (
      <View className='container'>
        <View className='flex align-center justify-center margin-top'>
          <Image src={path} mode='widthFix' className='img' />
        </View>
        <View className=' bg-white padding-sm radius-sm margin-sm'>
          <View className='text-darkGray text-xs'>识别结果</View>
          {
            dataArr.length == 0 ?
              <View className='padding-sm text-center'>
                没有识别到内容
              </View> :
              <View className='cu-list  grid col-3 margin-top-xs' style='padding:0rpx'>
                {items}
              </View>
          }
        </View>

        <View className=' bg-white padding-sm radius-sm margin-sm'>
          <View className='text-darkGray text-xs'>无法识别到？</View>
          <View class="cu-bar search bg-white">
            <View class="search-form round" onClick={this.onClick.bind(this, 2)}>
              <Text class="cuIcon-search"></Text>
              <Text className='text-grey text-df'>告诉Ai是什么物件</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
