import { useNavigate } from "react-router-dom"
import { api } from "../api"
import axios from "axios"

type InviteProps = {
    id: number
    projectId?: string
    username: string
}

export default function InviteButton ({id, username, projectId}: InviteProps) {

    const navigate = useNavigate();

    const handleInvite = async () => {
        try {
            console.log(projectId)
          await api.post(`/assignment/invite/${projectId}`, {
            invitedId: id
          })

          navigate(`/project/${projectId}`);
          
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
        <div className="bg-slate-800 py-3 rounded-2xl w-1/4 flex justify-around items-center"
        key={id}
        >
                <p className="font-semibold text-2xl"> {username} </p>
                <button className="bg-rose-600 hover:bg-rose-500 px-4 rounded-2xl font-semibold cursor-pointer"
                onClick={handleInvite}
                > Invite </button>
        </div>
    )
}