import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image } from '@tarojs/components'
import './index.scss'

import { AtSearchBar } from "taro-ui";
import JsonData from './index.json'
import classNames from 'classnames'
import RubbishCloudManager from '@/utils/manager/RubbishCloudManager';


export default class Index extends Component {

  config = {
    navigationBarTitleText: '小课堂',

  }
  constructor(props) {
    super(props)

    this.state = {
      dataArr: [],
    }
  }



  componentDidMount() {
    this.loadData()
  }

  loadData() {
    RubbishCloudManager.getRubbishSchool().then(ret => {
      console.log('===', ret);
      this.setState({
        dataArr: ret.result.data,
      })
    }).catch(e => {

    })
  }

  render() {
    const {
      dataArr,
    } = this.state;

    const items = dataArr && dataArr.map((item, idx) => {
      return (
        <View key={item.question} className='margin-top-lg'>
          <View className='bg-white padding-xs item-title' style='color:#859a4e'>
            误区{(idx + 1) + '：' + item.question}
          </View>
          <View className='text-white padding-sm'>
            {item.answer}
          </View>
        </View>
      )
    })
    return (
      <View className='container'>
        <Image src={require('@/images/ic_header.png')} mode='widthFix' style='width: 100%;' />
        {items}
      </View>
    )
  }
}
