import Taro, { Component, } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'
// import PropTypes from 'prop-types'
import classNames from 'classnames'
import '@/sdk/colorui/main.wxss'
import '@/sdk/colorui/icon.wxss'
import StoreManager from '@/utils/manager/StoreManager'
export default class Index extends Component {
  // static externalClasses = ['class-name', 'text-style']

  // static propTypes = {
  //   content: PropTypes.string,
  // };

  // static defaultProps = {
  //   fontSize: '20px'
  // }

  constructor(props) {
    super(props)
    this.state = {
      showAction: false,
    }
  }
  componentDidMount() {
    const tip = StoreManager.getStorageSync('tip')
    console.log('===tip==', tip, typeof tip)
    this.setState({
      showAction: (typeof tip == 'string' || tip) ? true : tip,
    })
  }

  onClickItem() {
    this.setState({
      showAction: false
    })
    StoreManager.setStorageSync('tip', false)

  }
  // onMove(e) {
  //   e.stopPropagation()
  // }
  render() {
    const {
      showAction
    } = this.state
    return (
      <View className={classNames("container", showAction ? 'show' : '')}>
        <View className='container-top'></View>
        <View className='container-content bg-green'>
          点击添加到我的小程序
          <Text onClick={this.onClickItem.bind(this)} className='cuIcon-close text-white margin-left-sm'></Text>
        </View>
      </View>
    )
  }
}
