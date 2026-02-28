import type { DashboardAssignmentType } from "../types/projectTypes"
import { useNavigate } from "react-router-dom"


export default function DashboardAssignment ({title, description, dueDate, id}: DashboardAssignmentType) {

    const navigate = useNavigate();

    const goToAssignment = () => navigate(`/assignment/${id}`)

    return (
        <button className="bg-slate-200 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-5 rounded-3xl flex flex-col gap-8 my-5 text-left w-full cursor-pointer"
        onClick={goToAssignment}
        >
            <p className="text-2xl font-semibold"> {title} </p>
            <p> {description} </p>
            <p className="self-end bg-slate-100 dark:bg-slate-600 py-1 px-3 rounded-2xl"> due by: {dueDate} </p>
        </button>
    )
}