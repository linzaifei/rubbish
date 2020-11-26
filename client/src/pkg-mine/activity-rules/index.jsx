import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image, Form } from '@tarojs/components'
import './index.scss'
import { Dicider } from "../../pkg-answer/answer-result/node_modules/@/components";
import { AtSearchBar } from "taro-ui";
import classNames from 'classnames'
import AppManager from '@/utils/AppManager';
import JsonData from './index.json'


export default class Index extends Component {

  config = {
    navigationBarTitleText: '活动规则',
  }
  constructor(props) {
    super(props)
    this.state = {

    }
  }



  componentDidMount() {

  }



  render() {
    const {

    } = this.state;


    return (
      <View className='container padding-sm'>

        <View className='text-lg text-bold margin-sm'>垃圾分类挑战活动规则如下:</View>
        <View className='bg-white padding-sm radius-sm'>
          <View className='text-df '>1、每次挑战通关为20题，通关成功得5分</View>
          <View className='text-df margin-top-sm'>2、平台以累计得分作为排名依据</View>
          <View className='text-df margin-top-sm'>3、排名当个自然月有效</View>
          <View className='text-df margin-top-sm'>3、每天挑战次数不受限制</View>
        </View>
      </View>
    )
  }
}
