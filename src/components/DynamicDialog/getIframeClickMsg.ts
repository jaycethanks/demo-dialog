
/**
 * 消息数据类型
 * @typedef {Object} MsgData
 * @property {number} clickX - 相对于整个浏览器窗口的X坐标
 * @property {number} clickY - 相对于整个浏览器窗口的Y坐标
 * @property {Object} element - 被点击的元素信息
 * @property {number} element.x - 元素在宿主窗口中的X坐标位置
 * @property {number} element.y - 元素在宿主窗口中的Y坐标位置
 * @property {number} element.height - 被点击元素的高度
 * @property {number} element.width - 被点击元素的宽度
 */
export type MsgData = {
    clickX: number
    clickY: number
    element: {
        x: number
        y: number
        height: number
        width: number
    }
}

export default function (messageHandler: Function) {
    window.addEventListener('message', function (event) {
        if (event.data.type === 'iframe-click') {
            messageHandler(event.data.clickEvent as MsgData)
        }
    })
}

// 绘制坐标调试
export const drawEl = (x: number, y: number) => {
    const div = document.createElement('div')
    div.style = `
    width:10px;
    height:10px;
    border-radius:100%;
    background-color:red;
    position: absolute;
    left:${x}px;
    top:${y}px
    `
    document.body.appendChild(div)
}





