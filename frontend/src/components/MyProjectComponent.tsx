import { useNavigate } from "react-router-dom"
import type { Project } from "../types/projectTypes"


export default function MyProject({title, description, numberOfMembers, numberOfAssignments,id}: Project) {

    const navigate = useNavigate()

    const goToProject = () => navigate(`/project/${id}`) 

    return (
        <button className="flex flex-col bg-slate-200 dark:bg-slate-800 p-8 gap-5 rounded-2xl w-full text-left cursor-pointer"
        onClick={(goToProject)}
        >
            <p className="text-2xl font-semibold"> {title}</p>
            <p className="font-semibold"> {description}</p>
            <p className="font-semibold"> Assignments: {numberOfAssignments}</p>
            <p className="font-semibold"> Members: {numberOfMembers}</p>
            <div className="flex gap-5 self-end">
                <button className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 dark:bg-rose-700 dark:hover:bg-rose-600 dark:active:bg-rose-500 p-2 rounded-2xl">
                    Edit
                </button>
                <button className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 dark:bg-rose-700 dark:hover:bg-rose-600 dark:active:bg-rose-500 p-2 rounded-2xl">
                    Delete
                </button>
            </div>
        </button>
    )
}