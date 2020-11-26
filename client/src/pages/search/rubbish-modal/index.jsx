import Taro, { Component, } from '@tarojs/taro'
import { View, Text, Form, Input, Image, Button, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import './index.scss'
import '@/sdk/colorui/main.wxss'
import '@/styles/index.scss'
import classNames from 'classnames'
export default class Index extends Component {

  constructor(props) {
    super(props)
    this.state = {
      params: {},
      showAction: false,
    }
  }

  componentDidMount() {


  }
  show(params) {
    Taro.vibrateShort({})
    this.setState({
      showAction: true,
      params,
    })
  }
  onHidden() {
    this.setState({
      showAction: false,
    })
  }
  onTouchMove(e) {
    console.log(' :滑动了>> ', '滑动了');
    return;
  }
  render() {
    const {
      showAction,
      params,
    } = this.state
    console.log('====', 'ic_lj' + params.type)
    const items = params && params['sub-contents'].map(item => {
      return (
        <View className='text-df text-left'>
          ■ {item}
        </View>
      )
    })
    return (
      <View className='index' onClick={this.onHidden.bind(this)}>
        <View class="cu-modal {{showAction?'show':''}}" >
          <View class="cu-dialog bg-white ">
            <View className='radius'>
              <View className='padding text-xxl text-white' style={{ backgroundColor: params.color }}>{params.name}</View>
              <View className='flex flex-direction padding-sm'>
                <Text className={classNames('iconfont text-left', 'ic_lj' + params.type)} style={{ color: params.color, fontSize: '100rpx', }}></Text>
                <Text className='text-xxl text-dark text-bold text-left margin-top'>{params.title}</Text>
                <View className='margin-top'>
                  {items}
                </View>
              </View>
            </View>
          </View>
        </View>
      </View >
    )
  }
}
