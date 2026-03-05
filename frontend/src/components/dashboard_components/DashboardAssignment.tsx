import type { AssignmentType } from "../../types/assignmentTypes";
import { useNavigate } from "react-router-dom"


export default function DashboardAssignment ({title, description, dueDate, id, projectId}: AssignmentType) {

    const navigate = useNavigate();

    const goToAssignment = () => navigate(`${projectId}/assignment/${id}`)

    return (
        <button className="bg-gray-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-5 rounded-xl flex flex-col gap-8 my-5 text-left w-full cursor-pointer"
        onClick={goToAssignment}
        >
            <p className="text-2xl font-semibold"> {title} </p>
            <p className="wrap-break-word w-[75%]"> {description} </p>
            <p className="self-end bg-gray-200 dark:bg-slate-600 py-1 px-3 rounded-2xl"> due by: {dueDate.split("T")[0]} </p>
        </button>
    )
}