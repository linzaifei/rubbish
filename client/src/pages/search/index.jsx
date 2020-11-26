import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, ScrollView, Image } from '@tarojs/components'
import './index.scss'

import { AtMessage } from "taro-ui";
import JsonData from '../index/index.json'
import classNames from 'classnames'
import RubbishCloudManager from '@/utils/manager/RubbishCloudManager';
import Tools from '@/utils/Tools'
import HotJson from './key.json'
import StoreManager from '@/utils/manager/StoreManager';
import RubbishModal from './rubbish-modal/index.jsx'


export default class Index extends Component {

  config = {
    navigationBarTitleText: '搜索结果',
  }

  constructor(props) {
    super(props)
    this.reg = {}
    this.state = {
      dataArr: [],
      keyword: '',
      show: false,
      historyList: [],
    }
  }
  componentDidMount() {
    this.reg = Tools.groupBy(JsonData.guide, 'type');
    const keyword = this.$router.params.keyword;
    this.setState({
      historyList: StoreManager.getHistoryList(),
    })
    console.log('=keyword===', keyword)
    if (keyword) {
      this.onClick(keyword)
    }
  }
  componentWillUnmount() {
    StoreManager.setHistoryList(this.state.historyList)
  }

  loadData() {
    const {
      keyword,
      historyList,
    } = this.state;
    const params = {
      keyword,
    }
    Tools.loading(true)
    RubbishCloudManager.getSearchRubbish(params).then(ret => {
      console.log('====', ret)
      const arr = ret.result.data;
      if (historyList.indexOf(keyword) == -1) {
        historyList.push(keyword)
      }
      this.setState({
        dataArr: arr,
        historyList,
      })
      Tools.loading(false)
    }).catch(e => {
      Tools.loading(false)
    })
  }


  //搜索
  onConfirm() {
    this.setState({
      show: this.state.keyword.length > 0,
    })
    if (!this.state.keyword) {
      Taro.atMessage({
        'message': '请输入关键词',
        'type': 'error',
      })
      this.setState({
        show: false,
      })
      return;
    }
    this.loadData()
  }

  onClick(key) {
    this.setState({
      keyword: key,
      show: true,
    }, () => {
      this.loadData()
    })
  }

  //补充数据
  onClickBC() {

  }

  onClickClear() {
    Taro.vibrateShort({})
    StoreManager.setHistoryList([])
    this.setState({
      historyList: [],
    })
  }
  onClickItem(item) {
    Tools.loading(true)
    RubbishCloudManager.getRubbishNote(item.category).then(ret => {
      Tools.loading(false)
      console.log('====', ret.result.data)
      const data = ret.result.data[0];
      data.name = item.name;
      this.rubbishModal.show(data)
    }).catch(e => {
      Tools.loading(false)
    })
  }
  //浏览记录
  getStartView() {
    const {
      historyList,
    } = this.state;
    const hots = HotJson.hot.map(item => {
      return (
        <View key={item} className='cu-tag text-df margin-bottom-sm radius' onClick={this.onClick.bind(this, item)}>
          {item}
        </View>
      )
    })
    const historys = historyList && historyList.map(item => {
      return (
        <View key={item} className='text-df padding-tb-sm line' onClick={this.onClick.bind(this, item)}>
          {item}
        </View>
      )
    })
    return (
      <View>
        <View className='padding-sm margin-sm bg-white radius-sm'>
          <View className='text-darkGray text-sm'>热门搜索</View>
          <View className='margin-top-sm'>
            {hots}
          </View>
        </View>
        <View className='padding-sm margin-sm margin-top-sm bg-white radius-sm'>
          <View className='text-darkGray text-sm'>搜索历史</View>
          <View className='margin-top-sm'>
            {historys}
          </View>
          {
            historyList.length > 0 ?
              < View className='text-sm margin-top-sm text-center' onClick={this.onClickClear.bind(this)}>清空历史</View> : null
          }
        </View>
      </View >
    )
  }

  //搜索结果
  getResultView() {
    const {
      dataArr,
      keyword,

    } = this.state;
    const items = dataArr && dataArr.map(item => {
      let key = item.category;
      if (parseInt(key) == 16) {
        key = 8;
      }
      const data = this.reg[key][0];
      return (
        <View key={item.name} className='text-lg padding-sm flex align-center justify-between line' onClick={this.onClickItem.bind(this, item)}>
          <Text className='text-lg'>{item.name}</Text>
          <View className='text-sm border-1' style={{
            color: data.color,
            borderColor: data.color
          }}>{data.name}</View>
        </View>
      )
    })
    if (dataArr.length == 0) {
      return (
        <View className=' flex justify-center flex-direction align-center' style='height:90vh' >
          <Image src={require('@/images/ic_null.png')} mode='widthFix' className='margin-top-xl' style='width:260rpx' />
          <Text className='text-df margin-top-df text-grey'>没有查询到？<Text className='text-green' onClick={this.onClickBC.bind(this)}>点此补充</Text></Text>
        </View>
      )
    }
    return (
      <View className='margin-sm bg-white radius-sm '>
        <View className='text-xxl text-bold padding-sm line'>相关垃圾</View>
        {items}
      </View>
    )
  }

  render() {
    const {
      dataArr,
      keyword,
      show,
    } = this.state;

    return (
      <View className='container'>
        <View class="cu-bar search bg-white">
          <View class="search-form round">
            <Text class="cuIcon-search"></Text>
            <Input type="text" value={keyword} onInput={(ret) => {
              this.setState({
                keyword: ret.detail.value
              })
            }} onConfirm={this.onConfirm.bind(this)} placeholder="请输入正确名称（包括材质）" confirm-type="search"></Input>
            {
              keyword.length > 0 ?
                <Text className='cuIcon-roundclose margin-right-sm' style='font-size:35rpx' onClick={() => {
                  this.setState({
                    keyword: '',
                    show: false,
                  })
                }}></Text> : null
            }
          </View>
          <View class="action">
            <Button class="cu-btn bg-green" onClick={this.onConfirm.bind(this)} >搜索</Button>
          </View>
        </View>

        <ScrollView>
          {show ? this.getResultView() : this.getStartView()}
        </ScrollView>
        <AtMessage />
        <RubbishModal ref={ref => this.rubbishModal = ref}></RubbishModal>
      </View>
    )
  }
}
