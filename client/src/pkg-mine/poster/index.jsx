import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input, Image, Form, ScrollView, Canvas } from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import CanvasManager from '@/components/canvas/CanvasManager'
import RubbishCloudManager from '@/utils/manager/RubbishCloudManager'
import AppManager from '@/utils/AppManager'
import Tools from '@/utils/Tools'
export default class Index extends Component {


  constructor(props) {
    super(props)
    this.query = '';
    this.tempFilePath = '';
    this.type = '';
    this.state = {
      header_img: '',
      score: 0,
    }
  }

  componentDidMount() {

    this.type = this.$router.params.type;
    this.query = Taro.createSelectorQuery().in(this.$scope)

    this.loadData()

  }

  loadData() {
    const userInfo = AppManager.getUserData();
    console.log('userinfo', userInfo)
    const arr = [Taro.downloadFile({ url: userInfo.avatarUrl }), RubbishCloudManager.getRubbishRankMine(parseInt(this.type))];
    Tools.loading(true)
    Promise.all(arr).then(ret => {
      Tools.loading(false)
      console.log('===', ret)
      const res = ret[0];
      const res1 = ret[1];
      const list = res1.result.list
      if (list.length > 0) {
        this.onDraw(res.tempFilePath, userInfo.nickName, list[0].score)
      } else {
        this.onDraw(res.tempFilePath, userInfo.nickName, 0)
      }
    }).catch(e => {
      console.log('====', e)
      Tools.loading(false)

    })
  }


  onLongClick() {
    console.log('=长按')
    const self = this;
    // 获取用户是否开启用户授权相册
    Taro.getSetting().then(ret => {
      if (!ret.authSetting['scope.writePhotosAlbum']) {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum',
        }).then(res => {
          self.saveImg()
        }).catch(e => {
        })
      } else {
        self.saveImg()
      }
    }).catch(e => {

    })
  }
  saveImg() {
    const self = this;
    console.log('===', self.tempFilePath)
    Taro.saveImageToPhotosAlbum({
      filePath: self.tempFilePath
    }).then(ret => {
      Taro.showToast({
        title: '保存成功'
      })
    }).catch(e => {
      Taro.showToast({
        title: '保存失败',
        icon: 'none'
      })
    })
  }


  onDraw(header_img, nickName, score) {
    // console.log('====数据', header_img, nickName, score)
    const self = this;

    this.query.select('#poster')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = Taro.getSystemInfoSync().pixelRatio
        const canvs_w = res[0].width;
        const canvs_h = res[0].height;
        canvas.width = canvs_w * dpr;
        canvas.height = canvs_h * dpr;
        ctx.scale(dpr, dpr)
        console.log('==w', canvs_w, canvs_h)

        const radius = 10;//圆角半径
        const poster_h = canvs_w * 612 / 1430;
        const header_width = 60;
        const header_height = 60;
        const header_x = (canvs_w - header_width) / 2;
        const header_y = poster_h - header_height / 2;




        CanvasManager.start(ctx)
        CanvasManager.drawCircle(ctx, 0, 0, canvs_w, canvs_h, radius)
        CanvasManager.end(ctx)
        ctx.fillStyle = '#fff'
        ctx.fill()
        CanvasManager.restore(ctx)



        /* 海报图片 */
        const path = require('@/images/banber/banner.png')
        CanvasManager.drawImage(canvas, path, 0, 0, canvs_w, poster_h, radius).then(r => {
          const path1 = header_img;//require('@/images/icon.png')
          CanvasManager.drawImage(canvas, path1, header_x, header_y, header_width, header_height, header_width / 2)

          CanvasManager.start(ctx)
          CanvasManager.drawCircle(ctx, header_x - 2, header_y - 2, header_width + 4, header_height + 4, (header_width + 4) / 2)
          CanvasManager.end(ctx)
          ctx.fillStyle = '#fff'
          ctx.fill()
          CanvasManager.restore(ctx)
        })


        const can_h = canvs_h * 3.4 / 5;
        const can_r = 15;

        CanvasManager.start(ctx)
        ctx.globalCompositeOperation = "source-out";
        ctx.arc(0, can_h, can_r, Math.PI * 3 / 2, Math.PI * 5 / 2);
        CanvasManager.end(ctx)
        ctx.fill()
        CanvasManager.restore(ctx)

        CanvasManager.start(ctx)
        ctx.globalCompositeOperation = "source-out";
        ctx.arc(canvs_w, can_h, can_r, Math.PI * 1 / 2, Math.PI * 3 / 2);
        CanvasManager.end(ctx)
        ctx.fill()
        CanvasManager.restore(ctx)


        CanvasManager.start(ctx);
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#fff';
        CanvasManager.drawDashed(ctx, { x: can_r, y: can_h }, { x: canvs_w - can_r, y: can_h }, [10, 10])
        CanvasManager.end(ctx);
        CanvasManager.restore(ctx);



        //显示文字
        const header_top = poster_h + header_height / 2 + 30;
        CanvasManager.start(ctx);
        ctx.textAlign = 'center'
        ctx.fillStyle = '#666'
        ctx.font = "16px Arial";
        CanvasManager.drawText(ctx, nickName, { x: canvs_w / 2, y: header_top })
        if (score > 0) {
          CanvasManager.drawText(ctx, '分类答题获得' + score + '分', { x: canvs_w / 2, y: header_top + 25 })
        } else {
          CanvasManager.drawText(ctx, '推荐使用实用垃圾分类了', { x: canvs_w / 2, y: header_top + 25 })
        }
        CanvasManager.drawText(ctx, '「实用垃圾分类」邀请您来答题', { x: canvs_w / 2, y: header_top + 50 })
        CanvasManager.restore(ctx)



        /*** 分享数据 */
        const text_x = (canvs_h - can_h) / 2 + can_h
        CanvasManager.start(ctx);
        ctx.fillStyle = 'grey'
        ctx.font = "14px Arial";
        CanvasManager.drawText(ctx, '长按二维码参与答题', { x: 10, y: text_x })
        CanvasManager.drawText(ctx, '来自「实用垃圾分类」', { x: 10, y: text_x + 23 })
        CanvasManager.restore(ctx)

        const icon_size = canvs_w * 2 / 5;
        const spacex = (canvs_w / 2 - icon_size) / 2;
        const spacey = ((canvs_h - can_h) - icon_size) / 2;
        const x = (canvs_w - spacex - icon_size);
        const y = (canvs_h - spacey - icon_size);
        const path2 = require('@/images/rubbish.jpg')
        CanvasManager.drawImage(canvas, path2, x, y, icon_size, icon_size, radius)


        Taro.canvasToTempFilePath({
          canvasId: 'poster',
          canvas: canvas,
          success: function (res) {
            self.tempFilePath = res.tempFilePath;
            console.log(self.tempFilePath);
          },
          fail: function (res) {
            console.log(res);
          }
        });

      })
  }



  render() {
    const windowWidth = Taro.getSystemInfoSync().windowWidth;
    const windowHeight = Taro.getSystemInfoSync().windowHeight;

    return (
      <View className='container flex justify-center'>
        <View className='margin-top-xl' onLongPress={this.onLongClick.bind(this)}>
          <Canvas id='poster' canvasId='poster' type='2d' style={{
            width: windowWidth * 0.80 + 'px',
            height: windowHeight * 0.63 + 'px',
          }}></Canvas>
        </View>
      </View >
    )
  }
}
