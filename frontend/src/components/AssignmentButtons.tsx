import { useState } from "react";
import type { ProjectRole } from "../types/projectTypes"
import type { AssignmentStatus } from "../types/assignmentTypes";
import ConfirmationModal from "./simple_components/ConfirmationModal";
import { handleProcess } from "../hooks/assignmentHook";
import { useNavigate } from "react-router-dom";

type AssignmentButtonsProps = {
    membership: ProjectRole
    status: AssignmentStatus
    projectId: number
    assignmentId: number
    isAssigned: boolean
    title: string
    goBack: boolean
    onSuccess: () => void
}

export default function AssignmentButtons ({membership, status, projectId, assignmentId, isAssigned, title, goBack, onSuccess}: AssignmentButtonsProps) {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    

    return (
        <>
        { membership !== "MEMBER" && ( 
            <button className="dark:bg-rose-700 active:dark:bg-rose-500 bg-rose-400 active:bg-rose-500 font-semibold p-3 w-2/5 rounded-sm cursor-pointer"
            onClick={() => setOpen(true)}
            >
                Delete
            </button>
        )}

        { membership !== "MEMBER" && status !== "DONE" && (
            <button className="dark:bg-rose-700 active:dark:bg-rose-500 bg-rose-400 active:bg-rose-500 font-semibold p-3 w-2/5 rounded-sm cursor-pointer"
            onClick={async () => {await handleProcess("put",`${projectId}/finish/${assignmentId}`)
            if (goBack) navigate('/');
            else onSuccess();
            }}
            >
                Complete
            </button>
        )}

        { membership !== "MEMBER" && status === "IN_PROGRESS" && (
            <button className="dark:bg-rose-700 active:dark:bg-rose-500 bg-rose-400 active:bg-rose-500 font-semibold p-3 w-2/5  rounded-sm cursor-pointer"
            onClick={async () =>  { await handleProcess("put",`${projectId}/decline/${assignmentId}`)
            onSuccess();
        }}
            >
                Decline
            </button>
        )}

        { isAssigned && status === "TODO" && (
            <button className="dark:bg-rose-700 active:dark:bg-rose-500 bg-rose-400 active:bg-rose-500 font-semibold p-3 w-2/5  rounded-sm cursor-pointer"
            onClick={ async () => {await handleProcess("put",`${projectId}/process/${assignmentId}`)
            onSuccess();
            }}
            >
                set to progress
            </button>
        )}

    <ConfirmationModal
    onClose={() => setOpen(false)}
    onConfirm={async () => {await handleProcess("delete",`${projectId}/delete/${assignmentId}`)
    if (goBack) navigate('/');
    else {
        onSuccess()
    }
    }}
    context="delete"
    title={title}
    open={open}
    />
    </>
    )
}