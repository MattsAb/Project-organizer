import { useEffect, useState } from "react";
import { api } from "../api";
import axios from "axios";
import type { InviteType } from "../types/inviteTypes";
import ErrorComponent from "../components/simple_components/ErrorComponent";

export default function InvitePage () {

    const [invites, setInvites] = useState<InviteType[]>([])
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        async function getInvites() {
            try {
                const response = await api.get(`/invite`)
                setInvites(response.data.invites)
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
        getInvites()
},[])

async function handleInvite (process: string, projectId: number, inviteId: number) {
    try {
        const response = await api.delete(`/invite/${projectId}/process/${inviteId}`,{
            params: { process }
        })
        if(response.data.success)
        {
            setInvites(prev => prev.filter(invite => invite.id !== inviteId))
        }
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            const backendMessage = err.response?.data?.message ?? err.message;
            console.log(backendMessage)
            setErrorMessage(backendMessage);
        } else 
        {
            console.log("Unexpected error", err);
        }
    }
}

    return (
        <div className="flex flex-col items-center w-full">
            <p className="font-bold text-3xl my-10"> Invites </p>
            {invites.length > 0 && (
            <div className="dark:bg-slate-800 bg-gray-50 w-2/3 flex flex-col items-center rounded-xl py-5">
                    {invites.map((invite) => (
                        <div className="dark:bg-slate-700 bg-gray-200 px-4 py-4 m-2 md:w-3/4 flex-col md:flex-row w-full rounded-sm flex items-center justify-between text-2xl gap-4" key={invite.id}> 
                            <div className="flex flex-col md:w-[60%] w-full flex-1">
                                <p className="font-semibold text-2xl"> {invite.invitedBy.username} </p>
                                <p> has invited you to join </p>
                                <p className="font-semibold w-full wrap-break-word"> {invite.project.title} </p>
                            </div>
                            <div className="flex gap-2 flex-wrap font-semibold">
                                <button className="dark:bg-rose-600 bg-rose-400 px-2 rounded-sm cursor-pointer"
                                onClick={() => handleInvite("ACCEPTED", invite.projectId, invite.id)}
                                >
                                    Accpet
                                </button>
                                <button className="dark:bg-rose-600 bg-rose-400 px-2 rounded-sm cursor-pointer"
                                onClick={() => handleInvite("DECLINED", invite.projectId, invite.id)}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))}
                
            </div>)}
            <ErrorComponent message={errorMessage}/>
            {errorMessage === "" && invites.length === 0 && <p className="flex items-center justify-center"> No invites </p>}
        </div>
    )
}