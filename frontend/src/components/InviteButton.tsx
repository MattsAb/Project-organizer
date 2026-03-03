import { useState } from "react"
import { api } from "../api"
import axios from "axios"

type InviteProps = {
    id: number
    projectId?: string
    username: string
}

export default function InviteButton ({id, username, projectId}: InviteProps) {

    const [invited, setInvited] = useState(false);

    const handleInvite = async () => {
      if (invited) return;

        try {
          await api.post(`invite/${id}/create/${projectId}`, {
            invitedId: id
          })
          setInvited(true)
          
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
              const backendMessage = err.response?.data?.message ?? err.message;
              console.log(backendMessage);
            } else 
            {
              console.log("Unexpected error", err);
            }
        }
    }

    return (
        <div className="dark:bg-slate-800 bg-gray-200 py-3 rounded-2xl w-full flex justify-around items-center"
        key={id}
        >
                <p className="font-semibold text-2xl"> {username} </p>
                <button className={`${invited ? 'dark:bg-slate-700 bg-gray-300'  :'dark:bg-rose-600 dark:hover:bg-rose-500 bg-rose-500 hover:bg-rose-400'} px-4 rounded-2xl font-semibold cursor-pointer`}
                onClick={handleInvite}
                > {invited ? 'Invited' : 'Invite'} </button>
        </div>
    )
}