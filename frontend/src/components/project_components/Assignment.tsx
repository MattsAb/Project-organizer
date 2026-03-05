import { useNavigate } from "react-router-dom"
import { useIsMobile } from "../../hooks/mobileHook"
import type { AssignmentType } from "../../types/assignmentTypes"

type AssignmentProps = {
  assignment: AssignmentType
  setDetails: (assignment: AssignmentType) => void
}

export default function Assignment ({assignment, setDetails}: AssignmentProps) {

    const date = new Date(assignment.dueDate)
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    const formattedDate = date.toISOString().split("T")[0]

    const handleClick = () => {
    if (isMobile) {
      navigate(`/${assignment.projectId}/assignment/${assignment.id}`)
    } else {
      setDetails(assignment)
    }
  }

    return (
        <button className={`bg-slate-50 dark:bg-slate-700 p-4 w-full rounded-sm flex cursor-pointer flex-col gap-3 text-left 
            ${ assignment.status === 'DONE' && 'opacity-50'}`}
        onClick={() => {
            handleClick()
        }}
        >

            <div className="flex items-center justify-between">
                <p className="font-semibold text-2xl wrap-break-word max-w-[80%]"> {assignment.title} </p>
                { assignment.status === 'DONE' && <p className=" bg-green-500 rounded-2xl px-2"> Completed </p>}
                { assignment.status === 'IN_PROGRESS' && <p className="text-green-600 dark:text-green-300 font-semibold"> Pending </p>}
            </div>

            
            <p className="wrap-break-word"> {assignment.description} </p>

            <div className="bg-gray-200 dark:bg-slate-600 font-semibold p-1 rounded-2xl self-baseline px-2">
                <p> Due By: {`${formattedDate}`} </p>
            </div>
            <div className="bg-rose-300 dark:bg-rose-800 font-semibold p-1 rounded-sm self-end px-2 max-w-[95%] wrap-break-word">
                <div className="wrap-break-word"> Assigned to: {assignment.assignees.map((assignee) => (
                    <p key={assignee.id}> {assignee.user.username}</p>
                ))}</div>
            </div>
        </button>
    )

}