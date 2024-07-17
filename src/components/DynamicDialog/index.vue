<script lang='ts' setup>
import { getCurrentInstance, nextTick, onMounted, onUnmounted, ref, toRef, watch } from "vue"
import { useVisible } from "./useVisible"
import { checkiIfClickedWithin } from "./checkiIfClickedWithin";
import { default as useMessage, drawEl, MsgData } from "./getIframeClickMsg";
import { useViewport } from "./useViewport";
import instances from "./instances";

const modalRef = ref<HTMLDivElement | null>(null)
const { visible, showModal, hideModal } = useVisible()
const left = ref<string | number>(0)
const top = ref<string | number>(0)
const transitionName = ref('v')
const disableTransition = () => {
    transitionName.value = ''
}
const enableTransition = () => {
    transitionName.value = 'v'
}
defineExpose({
    hideModal
})

const instance = getCurrentInstance()



// 直接作为组件 v-model 控制
const show = defineModel({ default: false })
const props = defineProps<{
    target?: EventTarget,
    listenIframe?: boolean // 是否作为全局监听 Iframe 组件，取决于该属性是否为 true
}>()

if (!props.listenIframe) {
    const targetRef = toRef(props, 'target');
    watch([targetRef, show], () => {
        // 最近的 父级 Button 元素的视口坐标, 以及元素宽高
        const button = (targetRef.value as Element).closest('button')
        if (!button) return
        const { left, top, height, width } = button.getBoundingClientRect()
        if (show.value) {
            // 显示modal
            setModalPosition(left, top, width, height, 10)
        } else {
            hideModal()
        }
    }, { deep: true, })
}


const setModalPosition = (x: number, y: number, btnW: number, btnH: number, margin: number) => {

    // 关闭全局所有其他modal 实例
    const ins = instances.values()
    for(let i of ins){
        i.exposed.hideModal()
    }


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

            // 可以把 视口宽度vw - Modal宽度， 和 vh - mh 构成的矩形区域视作 安全区域， 超出安全区域，那么modal位置要重新计算。 
            if (x + mw > vw.value) {
                computeX = x + btnW - mw
            }
            if (y + mh + btnH + margin > vh.value) {
                computeY = y - mh - margin
            }

            left.value = computeX + 'px';
            top.value = computeY + 'px';
            enableTransition()
            showModal()
        })
    })

    // 记录将当前 Modal 实例
    instances.set(instance?.uid, instance)


}

// 注册相关监听事件
onMounted(() => {
    // 点击事件在modal外，则关闭modal
    checkiIfClickedWithin(modalRef, ({ isWithIn }) => {
        if (!isWithIn) hideModal()
    })

    // 如果没有这个props 属性，就不用后续处理了
    if(!props.listenIframe){
        return
    }

    // 处理 Iframe 中的点击事件，弹出modal
    const messageHandler = (msg: MsgData) => {
        const { clickX, clickY, element: { x, y, height, width } } = msg
        const margin = 10
        setModalPosition(x, y, width, height, margin)
        // drawEl(x, y)
    }
    useMessage(messageHandler)
})







</script>
<template>
    <teleport to='body'>
        <transition :name="transitionName">
            <div v-if="visible" class="modal-root" ref="modalRef" :style="{ left, top }">
                <div class="modal-content">
                    <slot />
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