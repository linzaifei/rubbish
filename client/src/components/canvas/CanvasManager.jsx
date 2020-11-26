

/**
 * 绘制圆角
 * x,y 开始坐标点
 * width height 宽 高
 * radius 圆角
*/

function drawCircle(ctx, x = 0, y = 0, width, height, radius = 0) {
    if (width == 0 || height == 0) {
        throw new Error('宽高没有')
        return
    }

    const point1 = { x: x + radius, y: y }
    const point2 = { x: x + width - radius, y: y }
    const point3 = { x: x + width, y: y + radius }
    const point4 = { x: point3.x, y: y + height - radius }
    const point5 = { x: point2.x, y: y + height }
    const point6 = { x: point1.x, y: point5.y }
    const point7 = { x: x, y: point4.y }
    const point8 = { x: x, y: point3.y }

    ctx.moveTo(point1.x, point1.y)
    ctx.lineTo(point2.x, point2.y)
    ctx.arcTo(point3.x, y, point3.x, point3.y, radius)
    ctx.lineTo(point4.x, point4.y)
    ctx.arcTo(point3.x, point5.y, point5.x, point5.y, radius)
    ctx.lineTo(point6.x, point6.y);
    ctx.arcTo(x, point6.y, point7.x, point7.y, radius)
    ctx.lineTo(point8.x, point8.y)
    ctx.arcTo(x, y, point1.x, point1.y, radius)

}




/**
 * 绘制图片
 * 
*/
function drawImage(canvas, path, x, y, width, height, radius) {
    return new Promise(reslove => {
        const image = canvas.createImage()
        const ctx = canvas.getContext('2d')
        image.src = path;
        image.onload = () => {
            start(ctx)
            drawCircle(ctx, x, y, width, height, radius)
            end(ctx)
            ctx.drawImage(image, x, y, width, height);
            restore(ctx)
            reslove()
        }

    })
}


/**
 *  绘制圆弧 
 *  x	圆的中心的 x 坐标。
 *  y	圆的中心的 y 坐标。
 *  r	圆的半径。
 *  sAngle	起始角，以弧度计（弧的圆形的三点钟位置是 0 度）。
 *  Angle 需要画的角度
 * */
function drawArc(ctx, x, y, r, sAngle, eAngle) {
    const center = { x: x + r, y: y + r };
    ctx.arc(center.x, center.y, r, sAngle, eAngle)
}



/* 绘制虚线*/
function drawDashed(ctx, startPoint, endPoint, dash) {
    ctx.setLineDash(dash);
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(endPoint.x, endPoint.y);
    ctx.stroke()
}

function drawText(ctx, text, point,) {
    ctx.fillText(text, point.x, point.y)
}



function start(ctx) {
    ctx.save()
    ctx.beginPath()
}
function end(ctx) {
    ctx.closePath()
    ctx.clip();
}
function restore(ctx) {
    ctx.restore()
}





export default {
    drawCircle,
    drawImage,
    start,
    end,
    restore,
    drawDashed,
    drawText,

}