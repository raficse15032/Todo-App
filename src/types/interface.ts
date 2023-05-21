export interface Todo {
    title:string,
    id:number,
    status:boolean,
    _id:string
}

export interface Message {
    message: string,
    show: boolean,
    messageShow: (newMessage:string) => void
}