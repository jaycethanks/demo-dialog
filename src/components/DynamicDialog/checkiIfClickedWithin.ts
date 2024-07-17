
import { ref, Ref } from "vue";


export const checkiIfClickedWithin = (modalRef: Ref<HTMLElement | null>, cb: ({ isWithIn }: { isWithIn: boolean }) => void) => {
    // const isWithIn = ref(false)
    window.addEventListener('click', clickHandle, true)
    function clickHandle(event: Event) {
        if (modalRef.value) {
            const is = modalRef.value.contains(event.target as Node);
            cb({ isWithIn: is })
        }
    }

    window.addEventListener('message', function (event) {
        if (event.data.type === 'doc-click') {
            if(modalRef.value) {
                if(event.data.nodeName === 'BUTTON'){
                    console.log('nodeName',event.data.nodeName)
                }else{
                    cb({ isWithIn: false })
                }
            }
        }
    })

}