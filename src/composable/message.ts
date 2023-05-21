import { ref } from 'vue'

const message = ref('Bismillah')
const show = ref(false)

const messageShow = (newMessage:string) => {
    message.value = newMessage
    show.value = true
}

export {message,show,messageShow}