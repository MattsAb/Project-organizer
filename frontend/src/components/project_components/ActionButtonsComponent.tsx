import axios from "axios";
import { api } from "../../api";
import { useNavigate } from "react-router-dom";
import type { ProjectRole } from "../../types/projectTypes";
import ConfirmationModal from "../simple_components/ConfirmationModal";
import { useState } from "react";

type actionButtonsType = {
    id: string | undefined
    membership: ProjectRole
    title: string
}

export default function ActionButtons ({id, membership, title}: actionButtonsType) {

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

      async function handleLeave() {
        try {
            await api.delete(`/leave/${id}`)
            navigate('/');
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
    
        const gotoCreate = () => navigate(`/create/${id}`);
        const goToMembers = () => navigate(`/members/${id}`);
        const goToUserList = () => navigate(`/users/${id}`);

    return (
        <div className="flex-1-10 flex ml-5 flex-col gap-10 my-10 max-w-[20%]">

            <p className="font-semibold text-2xl"> actions</p>
            
            { membership !== "MEMBER" && (
                <button className="bg-slate-50 hover:bg-slate-100  dark:bg-slate-800 dark:hover:bg-slate-700 p-3 rounded-2xl cursor-pointer"
                onClick={gotoCreate}
                >
                    Add assignment
                </button>
            )}

            <button className="bg-slate-50 hover:bg-slate-100  dark:bg-slate-800 dark:hover:bg-slate-700 p-3 rounded-2xl cursor-pointer"
            onClick={goToMembers}
            >
                Project members
            </button>

            { membership !== "MEMBER" && (
                <button className="bg-slate-50 hover:bg-slate-100  dark:bg-slate-800 dark:hover:bg-slate-700  p-3 rounded-2xl cursor-pointer"
                onClick={(goToUserList)}
                >
                    Add new members
                </button>
            )}

            { membership !== "OWNER" && (
                <button className="bg-slate-50 hover:bg-slate-100  dark:bg-slate-800 dark:hover:bg-slate-700  p-3 rounded-2xl cursor-pointer"
                onClick={() => setOpen(true)}
                >
                    Leave project
                </button>
            )}

            <ConfirmationModal
            onClose={() => setOpen(false)}
            onConfirm={handleLeave}
            context="leave"
            title={title}
            open={open}
            />
        </div>
    )

}