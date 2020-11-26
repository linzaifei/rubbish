import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image } from '@tarojs/components'
import './index.scss'
import { AtSearchBar } from "taro-ui";
import JsonData from './index.json'
import classNames from 'classnames'
import BaiDuAIManager from '@/utils/manager/BaiDuAIManager';


export default class Index extends Component {

  config = {
    navigationBarTitleText: '语音识别',
    // #144a74
  }

  constructor(props) {
    super(props)
    this.recorderManager = ''
    this.state = {

    }
  }
  componentDidMount() {

  }

  loadData() {
    const {
      path,
    } = this.state;
    BaiDuAIManager.getImageData(path).then(ret => {
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


  //开始录音
  startRecord() {
    const self = this;
    this.recorderManager = Taro.getRecorderManager();
    const options = {
      duration: 30000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 48000,//编码码率
      format: 'aac',//音频格式，有效值 aac/mp3
    };
    console.log('开始正式录音前，canRecordStart：');

    //开始录音
    this.recorderManager.start(options);


    this.recorderManager.onStart(() => {
      console.log('recorder start')

    });
    this.recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    this.recorderManager.onError((res) => {
      console.error('录音错误回调：' + JSON.stringify(res));
    })
    //录音结束事件的回调函数
    this.recorderManager.onStop(res => {
      if (res && res.duration < 1000) {
        Taro.showToast({
          title: '说话时间太短啦！',
          icon: 'none'

        })
        return;
      }
      if (res && res.duration > 8000) {
        Taro.showToast({
          title: '说的有点长，可以精简点呀~',
          icon: 'none'
        })
        return;
      }

      self.onLoadData(res);
    })
  }


  onLoadData(res) {

    BaiDuAIManager.recogntionVop(res).then(ret => {
      console.log('===ret==', ret)
      // this.setState({
      //   dataArr: ret
      // })
    }).catch(e => {
      console.log('====', e)
    })

  }

  onTouchStart() {
    console.log('====开始露营')
    this.startRecord()
  }
  onTouchEnd() {
    console.log('====结束露营')
    this.recorderManager.stop()

  }

  render() {
    const {
      dataArr,
      path,
    } = this.state;

    return (
      <View className='container'>

        <View>
          <View className='title'>热门搜索</View>
        </View>
        <View>
          <View className='title'>识别结果</View>
        </View>



        <View className='bg-green rocordBtn' onTouchStart={this.onTouchStart.bind(this)} onTouchEnd={this.onTouchEnd.bind(this)} onTouchCancel={this.onTouchEnd.bind(this)}>
          录音识别
        </View>

      </View>
    )
  }
}
