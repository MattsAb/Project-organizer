import { useEffect, useState } from "react"
import type { MessageType } from "../types/messageTypes"
import { api } from "../api"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import ErrorComponent from "../components/simple_components/ErrorComponent"

export default function MessageInfo() {

    const [messageInfo, setMessageInfo] = useState<MessageType>()
    const [errorMessage, setErrorMessage] = useState('');

    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
    async function getMessage() {
        try {
                const response = await api.get(`/message/info/${id}`)
                setMessageInfo(response.data.message)
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const backendMessage = err.response?.data?.message ?? err.message;
                    console.log(backendMessage)
                    setErrorMessage(backendMessage)
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

    const goToCreate = () => navigate(`/message/${messageInfo?.senderId}`)

    return (
        <div>
            { messageInfo && (
            <div className="flex flex-col items-center justify-center gap-10">
                <h1 className="text-2xl font-semibold mt-10"> {messageInfo?.description}</h1>

                <div className="bg-gray-200 dark:bg-slate-800 p-10 rounded-3xl">
                    <p> {messageInfo?.body} </p>
                    <p className="self-end font-semibold text-right mt-5"> by: {messageInfo?.sender.username}</p>
                </div>
                <div className="flex gap-5">
                    <button className="dark:bg-rose-700 bg-rose-500 rounded-2xl p-4 font-semibold cursor-pointer"
                    onClick={handleDelete}
                    >
                        Delete message
                    </button>
                    <button className="dark:bg-rose-700 bg-rose-500 rounded-2xl p-4 font-semibold cursor-pointer"

                    onClick={goToCreate}
                    >
                        Send message
                    </button>
                </div>
            </div>)}
            <ErrorComponent message={errorMessage}/>
        </div>
    )
}