type SenderType = {
    username: string
}

export type MessageType = {
    id: number
    description?: string
    body: string
    isChecked: boolean
    senderId: number
    sender: SenderType
    receiverId: number
}