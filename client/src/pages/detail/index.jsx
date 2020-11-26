import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, ScrollView, } from '@tarojs/components'
import './index.scss'
import { AtSearchBar } from "taro-ui";
import JsonData from './index.json'
import classNames from 'classnames'
import RubbishCloudManager from '@/utils/manager/RubbishCloudManager';
import Tools from '@/utils/Tools';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '垃圾分类指南',
  }
  constructor(props) {
    super(props)
    this.type = 1;
    this.page = 1;
    this.state = {
      show: false,
      tipData: {},
      dataArr: [],
    }
  }
  componentDidMount() {
    const type = this.$router.params.type;
    console.log(type)
    this.type = type;
    this.loadData()
    this.loadRubbishData()

  }
  loadData() {
    RubbishCloudManager.getRubbishNote(this.type).then(ret => {
      console.log('===', ret)
      this.setState({
        tipData: ret.result.data[0]
      })
    }).catch(e => {
      console.log('===', e)
    })
  }

  loadRubbishData() {
    Tools.loading(true)
    RubbishCloudManager.getRubbishList(this.type, this.page).then(ret => {
      console.log('===', ret)
      const arr = ret.result.data;
      this.setState({
        dataArr: this.page > 1 ? this.state.dataArr.concat(arr) : arr,
      })
      Tools.loading(false)
    }).catch(e => {
      Tools.loading(false)
      console.log('===', e)
    })
  }

  loadMore() {
    Taro.vibrateShort({})
    this.page += 1;
    this.loadRubbishData()
  }

  render() {
    const {
      show,
      dataArr,
      tipData,
    } = this.state;

    const items = tipData && tipData['sub-contents'].map(item => {
      return (
        <View className='text-df'>
          ■ {item}
        </View>
      )
    })

    const itemvals = dataArr && dataArr.map(item => {
      return (
        <View className='text-lg padding-sm itemvals'>
          {item.name}
        </View>
      )
    })


    return (
      <View className='container'>
        <ScrollView scrollY>
          <View className="container-tip text-white margin-sm radius-sm padding-sm {{show?'openAnimation closeAnimation':'closeAnimation'}}" style='background-color:{{tipData.color}}'>
            <View className='padding-bottom-sm'>
              <View className='flex align-center justify-between'>
                <Text className='text-xl'>{tipData.title}</Text>
                <Text className={classNames('iconfont', 'ic_lj' + tipData.type)} style='font-size:60rpx'></Text>
              </View>

              <View className='content text-lg margin-top'>
                {tipData.content}
              </View>
              <View className='margin-top-sm text-df'>
                {items}
              </View>
            </View>

            <View className='container-tip-bottom flex justify-center ' style='background-color:{{tipData.color}}' onClick={() => {
              Taro.vibrateShort({})
              this.setState({ show: !this.state.show })
            }} >
              <Text className="ic_down iconfont {{show?'closeRotateAnimation':'openRotateAnimation'}}" style='font-size:40rpx'></Text>
            </View>
          </View>

          <View className='margin-sm bg-white radius-sm '>
            {itemvals}
          </View>

          <View className='text-center margin-sm padding-sm bg-white radius-sm' onClick={this.loadMore.bind(this)}>
            加载更多
          </View>

        </ScrollView>



      </View>
    )
  }
}
