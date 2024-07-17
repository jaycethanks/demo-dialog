

import { ref } from "vue";

function postDisableScrollEventMsg(){
    const iframes = document.querySelectorAll('iframe')
    iframes.forEach(iframe=>{
        iframe?.contentWindow?.postMessage({
            type:'disableScrollEvent'
        }, '*');
    })
}
function postEnableScrollEventMsg(){
    const iframes = document.querySelectorAll('iframe')

    iframes.forEach(iframe=>{
        iframe?.contentWindow?.postMessage({
            type:'enableScrollEvent'
        }, '*');
    })
}

// 阻止默认滚动行为
function preventDefault(e) {
    e.preventDefault();
}

// 禁用滚动
export const disableScroll = () => {
    document.addEventListener('wheel', preventDefault, { passive: false });
    postDisableScrollEventMsg()
}

// 启用滚动
export const enableScroll = () => {
    document.removeEventListener('wheel', preventDefault);
    postEnableScrollEventMsg()
}



/**
 * 定义 visible ref， 并决定合适时机禁用/启用 宿主页面/iframe 页面的滚动事件
 * @returns 
 */
export const useVisible = () => {
    const visible = ref(false)

    const showModal = () => {
        visible.value = true
        disableScroll()
    }
    const hideModal = () => {
        visible.value = false
        enableScroll()
    }

    return { visible, showModal, hideModal }
}
