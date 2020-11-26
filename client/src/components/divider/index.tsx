import Taro, { Component, } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.scss'

import PropTypes from 'prop-types'

export default class Index extends Component {
  static externalClasses = ['class-name', 'text-style']

  static propTypes = {
    content: PropTypes.string,
  };

  static defaultProps = {
    fontSize: '20px'
  }

  render() {
    const {
      content,
    } = this.props;
    return (
      <View className="divider">
        <View className="divider_first"></View>
        <Text className="divider_text">{content}</Text>
        <View className="divider_second"></View>
      </View>
    )
  }
}
