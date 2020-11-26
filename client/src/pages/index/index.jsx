import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import './index.scss'
import { Dicider, Collection } from "@/components";
import JsonData from './index.json'
import classNames from 'classnames'
import BaiDuAIManager from '@/utils/manager/BaiDuAIManager';


export default class Index extends Component {

  config = {
    navigationBarTitleText: '垃圾分类指南',
    navigationBarBackgroundColor: '#39b54a',
    backgroundTextStyle: "light",
    navigationBarTextStyle: 'white'


  }

  constructor(props) {
    super(props)
    this.keyword = '';
    this.state = {

    }
  }

  componentDidMount() {
    // BaiDuAIManager.getToken().then(ret => {
    //   console.log('====', ret.data.access_token)
    // }).catch(e => {
    //   console.log('===', e)
    // })
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

  }
  onClickGuideItem(type) {
    Taro.vibrateShort({})
    Taro.navigateTo({
      url: '/pages/detail/index?type=' + type,
    })
  }
  onClickToolItem(idx) {
    Taro.vibrateShort({})
    let path = ''
    switch (idx) {
      case 0:

        Taro.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
        }).then(ret => {
          const tempFilePaths = ret.tempFilePaths
          console.log('===', tempFilePaths)
          Taro.navigateTo({
            url: '/pkg-ai/camera/index?path=' + tempFilePaths[0],
          })
        })
        break;
      case 1:
        Taro.navigateTo({
          url: '/pages/school/index',
        })
        break;
      case 2:
        Taro.navigateTo({
          url: '/pkg-answer/answer-list/index',
        })
        break;
      case 3:
        Taro.navigateTo({
          url: '/pkg-answer/answer-record/index',
        })
        break;
      case 4:
        Taro.navigateTo({
          url: '/pkg-ai/vop/index',
        })
        break;

    }


  }


  getBannerView() {
    return (
      <Swiper
        className='swiper'
        indicatorColor='#999'
        indicatorActiveColor='#333'
        circular
        autoplay
      >
        <SwiperItem>
          <Image
            mode='aspectFit'
            src='cloud://rubbish-dev-6g6di3akcb86269c.7275-rubbish-dev-6g6di3akcb86269c-1304022726/banner/banner2.png'
          />
        </SwiperItem>
      </Swiper>
    )
  }
  getTools() {
    return JsonData.tools.map((item, index) => {
      return (
        <View key={item.icon} className='cu-item ' style='padding-bottom:10rpx' onClick={this.onClickToolItem.bind(this, index)}>
          <Text className={classNames('iconfont', item.icon)} style='font-size:50rpx;align-self:center;margin-right:0rpx'></Text>
          <View className='text-df text-darkGray margin-top-xs'>{item.name}</View>
        </View >
      )
    })
  }
  getGuideView() {
    return JsonData.guide.map((item, index) => {
      return (
        <View key={item.icon} className='cu-item ' style='padding-bottom:10rpx ' onClick={this.onClickGuideItem.bind(this, item.type)}>
          <View className='flex align-center margin-sm '>
            <Text className={classNames('iconfont', item.icon)} style='font-size:60rpx'></Text>
            <View>
              <Text className='text-left text-lg' >{item.name}</Text>
              <View className='text-df'>{item.en}</View>
            </View>
          </View>
        </View>
      )
    })
  }
  render() {

    return (
      <View className='container'>
        <View className='container-bg'>
          {this.getBannerView()}
        </View>
        <View className='container-search bg-white radius-sm'>
          <View class="cu-bar search bg-white">
            <View class="search-form round" onClick={() => {
              Taro.navigateTo({
                url: '/pages/search/index',
              })
            }}>
              <Text class="cuIcon-search"></Text>
              <Text className='text-grey text-df'>请输入正确名称（包括材质）</Text>
            </View>
          </View>
        </View>

        <View className='container-tools bg-white padding-sm radius-sm'>
          <View className='text-darkGray text-xs'>实用工具</View>
          <View className='cu-list  grid col-4 no-border margin-top-xs' style='padding:0rpx'>
            {this.getTools()}
          </View>
        </View>

        <View className='container-guide bg-white padding-sm radius-sm margin-sm'>
          <View className='text-darkGray text-xs'>分类指南</View>
          <View className='cu-list  grid col-2 margin-top-xs' style='padding:0rpx'>
            {this.getGuideView()}
          </View>
        </View>

        <View className='container-note margin-sm'>
          <Text className='text-sm text-grey '>备注：湿垃圾（又名厨余垃圾、易腐垃圾、餐厨垃圾），干垃圾（又名其他垃圾），生活垃圾分类同时包括：装修垃圾和大件垃圾</Text>
        </View>
        <View className='container-center bg-green text-sm shadow' onClick={() => {
          Taro.vibrateShort({})
          Taro.navigateTo({
            url: '/pkg-mine/mine/index'
          })
        }}>个人中心</View>

        <Dicider content='linzaifei'></Dicider>
        <Collection></Collection>
      </View>
    )
  }
}
