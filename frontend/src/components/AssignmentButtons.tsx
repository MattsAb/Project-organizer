import { useState } from "react";
import type { ProjectRole } from "../types/projectTypes"
import type { AssignmentStatus } from "../types/assignmentTypes";
import ConfirmationModal from "./simple_components/ConfirmationModal";
import { handleProcess } from "../hooks/assignmentHook";

type AssignmentButtonsProps = {
    membership: ProjectRole
    status: AssignmentStatus
    projectId: number
    assignmentId: number
    isAssigned: boolean
    title: string
}

export default function AssignmentButtons ({membership, status, projectId, assignmentId, isAssigned, title}: AssignmentButtonsProps) {

    const [open, setOpen] = useState(false);

    return (
        <>
        { membership !== "MEMBER" && ( 
            <button className="dark:bg-rose-700 active:dark:bg-rose-500 bg-rose-500 active:bg-rose-400 font-semibold p-3 w-1/4 rounded-2xl cursor-pointer"
            onClick={() => setOpen(true)}
            >
                Delete
            </button>
        )}

        { membership !== "MEMBER" && status !== "DONE" && (
            <button className="dark:bg-rose-700 active:dark:bg-rose-500 bg-rose-500 active:bg-rose-400 font-semibold p-3 w-1/4 rounded-2xl cursor-pointer"
            onClick={() =>  handleProcess("put",`${projectId}/finish/${assignmentId}`)}
            >
                Complete
            </button>
        )}

        { membership !== "MEMBER" && status === "IN_PROGRESS" && (
            <button className="dark:bg-rose-700 active:dark:bg-rose-500 bg-rose-500 active:bg-rose-400 font-semibold p-3 w-1/4 rounded-2xl cursor-pointer"
            onClick={() =>  handleProcess("put",`${projectId}/decline/${assignmentId}`)}
            >
                Decline
            </button>
        )}

        { isAssigned && status === "TODO" && (
            <button className="dark:bg-rose-700 active:dark:bg-rose-500 bg-rose-500 active:bg-rose-400 font-semibold p-3 w-1/4 rounded-2xl cursor-pointer"
            onClick={() => handleProcess("put",`${projectId}/process/${assignmentId}`)}
            >
                set to progress
            </button>
        )}

    <ConfirmationModal
    onClose={() => setOpen(false)}
    onConfirm={() => handleProcess("delete",`${projectId}/delete/${assignmentId}`)}
    context="delete"
    title={title}
    open={open}
    />
    </>
    )
}