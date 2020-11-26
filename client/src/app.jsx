import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'
import AppManager from '@/utils/AppManager'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  config = {
    pages: [
      'pages/index/index',
      'pages/school/index',
      'pages/detail/index',
      'pages/search/index',
    ],
    subPackages: [{
      root: 'pkg-mine',
      pages: [
        'mine/index',
        'activity-rules/index',
        'rank/index',
        'poster/index',
      ]
    }, {
      root: 'pkg-answer',
      pages: [
        'answer/index',
        'answer-list/index',
        'answer-result/index',
        'answer-question/index',
        'answer-statistics/index',
        'answer-record/index',
      ]
    }, {
      root: 'pkg-ai',
      pages: [
        'camera/index',
        'vop/index',
      ]
    }],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black'
    },
    cloud: true,
    permission: {
      "scope.writePhotosAlbum": {
        "desc": "获取您的相册"
      }
    }

  }

  componentDidMount() {
    if (process.env.TARO_ENV === 'weapp') {
      AppManager.start()
    }
  }


  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
