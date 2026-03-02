import axios from "axios";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";
import type { ProjectRole } from "../../types/projectTypes";

type actionButtonsType = {
    id: string | undefined
    membership: ProjectRole
}

export default function ActionButtons ({id, membership}: actionButtonsType) {

    const navigate = useNavigate();


      async function handleLeave() {
        try {
            await api.delete(`/leave/${id}`)
            navigate('/');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
            //const backendMessage = err.response?.data?.message ?? err.message;
            } else 
            {
            console.log("Unexpected error", err);
            }
        }
      }
    
        const gotoCreate = () => navigate(`/create/${id}`);
        const goToMembers = () => navigate(`/members/${id}`);
        const goToUserList = () => navigate(`/users/${id}`);

    return (
        <div className="flex-1 mx-10 flex flex-col gap-10 my-10">

            <p className="font-semibold text-2xl"> actions</p>
            
            { membership !== "MEMBER" && (
                <button className="bg-slate-300 hover:bg-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 p-3 rounded-2xl cursor-pointer"
                onClick={gotoCreate}
                >
                    Add assignment
                </button>
            )}

            <button className="bg-slate-300 hover:bg-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 p-3 rounded-2xl cursor-pointer"
            onClick={goToMembers}
            >
                Project members
            </button>

            { membership !== "MEMBER" && (
                <button className="bg-slate-300 hover:bg-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 p-3 rounded-2xl cursor-pointer"
                onClick={(goToUserList)}
                >
                    Add new members
                </button>
            )}

            { membership !== "OWNER" && (
                <button className="bg-slate-300 hover:bg-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 p-3 rounded-2xl cursor-pointer"
                onClick={handleLeave}
                >
                    Leave project
                </button>
            )}
        </div>
    )

}