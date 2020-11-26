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

  onMove(e) {
    e.stopPropagation()
  }
  render() {
    const {

    } = this.props;
    return (
      <View className="zf-modal show" onTouchMove={this.onMove.bind(this)} >


        <View>
          dsadsa
        </View>

      </View>
    )
  }
}
