import { useEffect, useState } from "react"
import type { MessageType } from "../types/messageTypes"
import { api } from "../api"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

export default function MessageInfo() {

    const [messageInfo, setMessageInfo] = useState<MessageType>()

    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
    async function getMessage() {
        try {
                const response = await api.get(`/message/info/${id}`)
                setMessageInfo(response.data.message)
                console.log(response.data.messages)
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                console.log(backendMessage)

                } else 
                {
                console.log("Unexpected error", err);

                }
            }
        }
        getMessage()
    },[id])


    async function handleDelete() {

    try {
            await api.delete(`/message/delete/${id}`)
            navigate('/messages');
    } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
            const backendMessage = err.response?.data?.message ?? err.message;
            console.log(backendMessage)

        } else 
        {
            console.log("Unexpected error", err);

        }
    }

    }

    return (
        <div>
            <p> {messageInfo?.body} </p>

            <button className="bg-slate-800 p-4 cursor-pointer"
            onClick={handleDelete}
            >
                Delete Message
            </button>
        </div>
    )
}