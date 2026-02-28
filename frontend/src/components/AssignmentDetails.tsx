import type { AssignmentType } from "../types/assignmentTypes";

export default function AssignmentDetails (details: AssignmentType) {


    return (
        <div className="bg-slate-200 dark:bg-slate-800 p-5 rounded-3xl flex flex-col items-center gap-10">
            <p> {details.title} </p>
            <p> {details.description}</p>
            <p> Due by: {details.dueDate}</p>
            <p> status: {details.isCompleted && 'Completed'} {details.isPending && 'Pending'}</p>
            <p> Assigned to: {details.assignees[0].user.username}</p>
        </div>
    )
}