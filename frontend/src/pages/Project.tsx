import { useEffect, useState } from "react"
import Assignment from "../components/Assignment"
import AssignmentDetails from "../components/AssignmentDetails"
import type { AssignmentType } from "../types/assignmentTypes"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router-dom"
import { api } from "../api"
import axios from "axios"


export default function Project () {

    const [assignments, setAssignments] = useState<AssignmentType[]>([])
    const [selectedAssignment, setSelectedAssignment] = useState<AssignmentType>()

    const navigate = useNavigate();
    const { id } = useParams()

     useEffect(() => {
        const getProjectAssignments = async () => {
            try {
                const response = await api.get(`/assignment/${id}`);
                setAssignments(response.data);
            } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                console.log(backendMessage);

            } else {
                console.log("Unexpected error", err);

            }
            }
        } 
        getProjectAssignments()
  }, [id]);

    const gotoCreate = () => navigate(`/create/${id}`);
    const goToMembers = () => navigate(`/members/${id}`);
    const goToUserList = () => navigate(`/users/${id}`);

    return (
        <div className="flex justify-center min-h-screen text-black dark:text-white">
            <div className="flex-1 mx-10 flex flex-col gap-10 my-10">
                <p className="font-semibold text-2xl"> actions</p>
                <button className="bg-slate-300 hover:bg-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 p-3 rounded-2xl cursor-pointer"
                onClick={gotoCreate}
                >
                    Add assignment
                </button>
                <button className="bg-slate-300 hover:bg-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 p-3 rounded-2xl cursor-pointer"
                onClick={goToMembers}
                >
                    Project members
                </button>
                <button className="bg-slate-300 hover:bg-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 p-3 rounded-2xl cursor-pointer"
                onClick={(goToUserList)}
                >
                    Add new members
                </button>
                <button className="bg-slate-300 hover:bg-slate-200 active:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-600 p-3 rounded-2xl cursor-pointer">
                    Complete project
                </button>
            </div>

            <div className="flex items-center">
                <div className="w-px bg-rose-400 dark:bg-rose-800 h-7/8"></div>
            </div>

            <div className="flex-2 mx-10 flex flex-col gap-10 my-10">
                <p className="font-semibold text-2xl"> asignments </p>
                {assignments.length > 0 && (
                assignments.map((assignment) => (
                    <Assignment 
                    key={assignment.id}
                    setDetails={setSelectedAssignment} 
                    assignment={assignment}/>
                ))
                )}
            </div>

            <div className="flex items-center">
                <div className="w-px bg-rose-400 dark:bg-rose-800 h-7/8"></div>
            </div>

            <div className="flex-3 mx-10 flex flex-col gap-10 my-10">
                <p className="font-semibold text-2xl"> Details </p>
                { selectedAssignment && <AssignmentDetails {...selectedAssignment} /> }          
            </div>
        </div>
    )
}