import type { AssignmentType } from "../../types/assignmentTypes";
import { useAuth } from "../../hooks/authHook";
import type { ProjectRole } from "../../types/projectTypes";
import AssignmentButtons from "../AssignmentButtons";

type InfoProps = {
    details: AssignmentType
    membership: ProjectRole
}

export default function AssignmentDetails ({details, membership}: InfoProps) {

    const {user} = useAuth();

    const isAssigned = details?.assignees.some(a => a.user.id === user?.id)

    return (
        <div className="bg-slate-200 dark:bg-slate-800 p-5 rounded-3xl flex flex-col items-center text-2xl font-semibold gap-10 text-center">
            <p className="font-semibold text-3xl"> {details.title} </p>
            <p className="text-2xl"> {details.description}</p>
            <p> Due by: {details.dueDate.split("T")[0]}</p>
            <div className="flex items-center gap-2 justify-center">
                <p> Status: </p>
                <p className={`${details.status === "DONE" && "bg-green-600"}
                ${details.status === "IN_PROGRESS" && `text-green-400`} px-3 py-2 rounded-2xl`}
                > 
                {details.status === "DONE"  && 'Completed'} 
                {details.status === "IN_PROGRESS" && 'Pending'}
                {details.status === "TODO" && 'In process'}
                </p>
             </div>

            <div className="flex flex-col items-center">
                <p className="mb-3">Assigned to:</p>
                <div className="flex"> 
                    {details.assignees.map((assignee) => (
                        <p key={assignee.id} className="font-semibold bg-gray-300 dark:bg-slate-700 py-2 px-4 rounded-2xl text-center mx-1"> {assignee.user.username} </p>
                    ))}
                </div>
            </div>

            <div className="flex w-full items-center justify-center gap-5">
                <AssignmentButtons 
                membership={membership}
                status={details.status}
                title={details.title}
                projectId={details.projectId}
                assignmentId={details.id}
                isAssigned={isAssigned}
                />
            </div>
        </div>
    )
}