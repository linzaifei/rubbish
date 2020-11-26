import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Block, Button, Switch, Form, Slider, Canvas } from '@tarojs/components'
import './index.scss'


import Charts from '@/sdk/charts/js/wxcharts.js'

import RunManager from './RunManager'
import AnswerManager from '../AnswerManager'
import StatisticsManager from './StatisticsManager'
export default class Index extends Component {

  config = {
    navigationBarTitleText: '答题统计',
  }
  constructor(props) {
    super(props)
    this.state = {
      dataArr: [],
      dataArr1: [],
      dataArr2: []
    }
  }

  componentDidMount() {

    this.loadData()


  }



  loadData() {
    AnswerManager.getApm().then(ret => {
      console.log('===', ret)
      const list = ret.result.list
      this.setState({
        dataArr: list
      }, () => {
        if (list.length > 0) {
          this.onDrawCharts(ret.result.list)
        }
      })
    })
    AnswerManager.getApmBank().then(ret => {
      console.log('=ret==', ret)
      const list = ret.result.list
      if (list.length > 0) {
        this.onDrawCharts1(ret.result.list)
      }
    })
  }


  onDrawCharts1(list) {
    const data = StatisticsManager.getAnswerRatio(list)
    this.setState({
      dataArr1: data.series,
      dataArr2: data.series1,
    }, () => {
      new Charts({
        canvasId: 'pieCanvas',
        type: 'pie',
        series: data.series,
        width: 200,
        height: 200,
        dataLabel: false
      });
      new Charts({
        canvasId: 'pieCanvas1',
        type: 'pie',
        series: data.series1,
        width: 200,
        height: 200,
        dataLabel: false
      });
    })
  }


  onDrawCharts(list) {

    const columnData = StatisticsManager.getQuestionBank(list)
    console.log('==columnData==', columnData)
    new Charts({
      canvasId: 'columnCanvas',
      type: 'column',
      ...columnData,
      yAxis: {
        format: function (val) {
          return val + '题';
        }
      },
      width: 300,
      height: 200,
    });

  }





  getTitleView(title) {
    return (
      <View class="action margin-left margin-bottom ">
        <Text class="cuIcon-titles text-theme"></Text>
        <Text class="text-sm text-grey">{title}</Text>
      </View>
    )
  }



  render() {
    const {
      dataArr,
      dataArr1,
      dataArr2
    } = this.state;

    return (
      <View className='continer'>
        <View className='text-center text-xl padding-xs margin-xl solid-bottom-gray'>答题统计</View>

        {this.getTitleView('每天答题比例')}
        {
          dataArr.length > 0 ?
            <Canvas className="columnCanvas" canvasId="columnCanvas"></Canvas> :
            <View className='nullView'>暂无数据请先去答题</View>
        }



        {this.getTitleView('答题题库对比')}
        <View className='flex align-center'>
          <View className='pieCanvas'>
            {
              dataArr1.length > 0 ?
                <Canvas className="pieCanvas" canvasId="pieCanvas"></Canvas> :
                <View className='nullView'>暂无数据</View>
            }

            <View className='text-sm text-center'>题库一</View>
          </View>
          <View className='pieCanvas'>
            {
              dataArr2.length > 0 ?
                <Canvas className="pieCanvas" canvasId="pieCanvas1"></Canvas> :
                <View className='nullView'>暂无数据</View>
            }
            <View className='text-sm text-center'>题库二</View>
          </View>
        </View>



      </View >
    )
  }
}
