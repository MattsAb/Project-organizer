import { useEffect, useState } from "react";
import { api } from "../api";
import axios from "axios";
import type { MessageType } from "../types/messageTypes";
import { useNavigate } from "react-router-dom";
import ErrorComponent from "../components/simple_components/ErrorComponent";

export default function MessagePage () {

    const [messages, setMessages] = useState<MessageType[]>([])
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        async function getMessages() {
            try {
                const response = await api.get(`/message`)
                setMessages(response.data.messages)
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
        getMessages()
},[])

const goToMessage = (id: number) => navigate(`/messageinfo/${id}`)

    return (
        <div className="flex flex-col items-center w-full">
            <p className="font-bold text-3xl my-10"> Messages </p>
            {messages.length > 0 && (
            <div className="dark:bg-slate-800 bg-slate-200 w-1/2 flex flex-col items-center rounded-2xl py-5">
                   { messages.map((message) => (
                        <button className="dark:bg-slate-700 bg-slate-300 px-4 py-4 m-2 w-2/3 rounded-2xl flex items-center text-2xl gap-4 cursor-pointer" key={message.id}
                        onClick={() => goToMessage(message.id)}> 

                            <div className="flex gap-2 flex-col flex-wrap min-w-0 flex-1 text-left">

                                <p className="font-semibold text-2xl"> {message.sender.username} </p>
                                <p className="font-semibold wrap-break-word"> {message.description} </p>
                                
                            </div>
                            <p className={`${!message.isChecked && "text-green-500"}`}>{message.isChecked ? "Read" : "New!"}</p>

                        </button>
                    ))}
            </div>
            )}
            <ErrorComponent message={errorMessage}/>
            {errorMessage === "" && messages.length === 0 && <p className="flex items-center justify-center"> No messages </p>}
        </div>
    )
}