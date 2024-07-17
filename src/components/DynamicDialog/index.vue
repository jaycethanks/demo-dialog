<script lang='ts' setup>
import { nextTick, onMounted, reactive, ref } from "vue"
import { useMessage, drawEl, MsgData } from "./listener";
import { useVisible } from "./useVisible"
import { checkiIfClickedWithin } from "./checkiIfClickedWithin";
import { useViewport } from "./useViewport";
const modalRef = ref<HTMLDivElement | null>(null)
const { visible, showModal, hideModal } = useVisible()
const left = ref<string | number>(0)
const top = ref<string | number>(0)
const transformOrigin = ref("bottom left")
const transitionName = ref('v')
const disableTransition = () => {
    transitionName.value = ''
}
const enableTransition = () => {
    transitionName.value = 'v'
}



const setModalPosition = (x: number, y: number, btnW: number, btnH: number, margin: number) => {
    // 动态获取modal的宽高
    // 关闭 transition 开关，以获取正确的高度， 先显示modal
    disableTransition()
    showModal()
    nextTick(() => {
        // 下一次渲染循环中，获取到 modal 的宽高，然后关闭modal
        const { offsetHeight: mh, offsetWidth: mw } = modalRef.value!
        hideModal()
        nextTick(() => {
            // 再下一次渲染循环中，打开modal
            // 当前x, y 是点击按钮的左上角坐标， 真实的位置需要动态计算
            let computeX = x
            let computeY = y + btnH + margin

            const { vw, vh } = useViewport()

            if (x + mw > vw.value) {
                computeX = x + btnW - mw
            }
            if (y + mh + btnH + margin > vh.value) {
                computeY = y - mh - margin
            }

            left.value = computeX + 'px';
            top.value = computeY + 'px';
            console.log("triggger")


            enableTransition()
            showModal()
        })
    })
}

onMounted(() => {

    // 处理 Iframe 中的点击事件，弹出modal
    const messageHandler = (msg: MsgData) => {
        const { clickX, clickY, element: { x, y, height, width } } = msg
        const margin = 10
        setModalPosition(x, y, width, height, margin)
        drawEl(x, y)

    }
    useMessage(messageHandler)

    // 点击事件在modal外，则关闭modal
    checkiIfClickedWithin(modalRef, ({ isWithIn }) => {
        if (!isWithIn) hideModal()
    })

})

</script>
<template>
    <teleport to='body'>
        <transition :name="transitionName">
            <div v-if="visible" class="modal-root" ref="modalRef" :style="{ left, top, transformOrigin }">
                <div class="modal-content">
                    <slot/>
                </div>
            </div>
        </transition>
    </teleport>
</template>
<style lang='css' scoped>
.modal-root {
    position: fixed;
    z-index: 2000;
    /* top: 0;
    left: 0; */
    width: 300px;
    height: auto;
    display: grid;
    grid-template-rows: 1fr;
    overflow: hidden;
    transform-origin: bottom right;
}

.modal-content {
    min-height: 0;
}

.v-enter-active,
.v-leave-active {
    transition: 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    grid-template-rows: 0fr;
    opacity: 0;
}
</style>