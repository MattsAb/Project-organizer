import { useEffect, useState } from "react";
import { api } from "../api";
import axios from "axios";
import type { InviteType } from "../types/inviteTypes";

export default function InvitePage () {

    const [invites, setInvites] = useState<InviteType[]>([])

    useEffect(() => {
        async function getInvites() {
            try {
                const response = await api.get(`/invite`)
                setInvites(response.data.invites)
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

        getInvites()
},[])

async function handleInvite (process: string, projectId: number, inviteId: number) {
    try {
        await api.delete(`/invite/${projectId}/process/${inviteId}`,{
            params: { process }
        })
        window.location.reload();
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
        <div className="flex flex-col items-center w-full">
            <p className="font-bold text-3xl my-10"> Invites </p>
            <div className="bg-slate-800 w-2/3 flex flex-col items-center rounded-2xl py-5">
                {invites.length > 0 && (
                    invites.map((invite) => (
                        <div className="bg-slate-700 px-4 py-4 m-2 w-2/3 rounded-2xl flex items-center justify-between text-2xl gap-4" key={invite.id}> 
                            <div className="flex gap-2 flex-wrap min-w-0 flex-1">
                                <p className="font-semibold text-2xl"> {invite.invitedBy.username} </p>
                                <p> has invited you to join </p>
                                <p className="font-semibold wrap-break-word"> {invite.project.title} </p>
                            </div>
                            <div className="flex gap-2 flex-wrap min-w-0 font-semibold">
                                <button className="bg-rose-600 px-2 rounded-2xl cursor-pointer"
                                onClick={() => handleInvite("ACCEPTED", invite.projectId, invite.id)}
                                >
                                    Accpet
                                </button>
                                <button className="bg-rose-600 px-2 rounded-2xl cursor-pointer"
                                onClick={() => handleInvite("DECLINED", invite.projectId, invite.id)}
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}