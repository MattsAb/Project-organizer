import { useNavigate } from "react-router-dom"
import type { MyProjectType } from "../types/projectTypes"
import { api } from "../api"
import axios from "axios"
import ConfirmationModal from "./simple_components/ConfirmationModal"
import { useState } from "react"

type myProjectProps = {
    projectInfo: MyProjectType
    canDelete: boolean
    onDelete: (id: string) => void
}


export default function MyProject({projectInfo, canDelete, onDelete}: myProjectProps) {

    const [openModal, setOpenModal] = useState(false)

    const navigate = useNavigate()

    const goToProject = () => navigate(`/project/${projectInfo.id}?title=${encodeURIComponent(projectInfo.title)}`) 

    async function handleDelete () {
        try {
            await api.delete(`/delete/${projectInfo.id}`)
            onDelete(`${projectInfo.id}`)
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                console.log(err.message)
            } else 
            {
                console.log("Unexpected error", err);
            }
        }

    }

    return (
        <div className="flex items-center">
            <button className="flex flex-3 flex-col bg-slate-50 dark:bg-slate-800 p-8 gap-5 rounded-sm w-full text-left cursor-pointer"
            onClick={(goToProject)}
            >
                <p className="text-2xl font-semibold"> {projectInfo.title}</p>
                <p className="font-semibold"> {projectInfo.description}</p>
                <p className="font-semibold"> Assignments: {projectInfo._count.assignments}</p>
                <p className="font-semibold"> Members: {projectInfo._count.members}</p>
            </button>
            { canDelete && (
            <button className="dark:bg-rose-700 bg-rose-400 flex-1 mx-5 py-5 rounded-sm font-semibold cursor-pointer"
            onClick={() => setOpenModal(!openModal)}
            >
                Delete
            </button>)}
            <ConfirmationModal context={"delete"} title={projectInfo.title} open={openModal} onClose={() => setOpenModal(false)} onConfirm={handleDelete}/>
        </div>
    )
}