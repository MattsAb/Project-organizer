import { useEffect, useState } from "react"
import Assignment from "../components/Assignment"
import AssignmentDetails from "../components/AssignmentDetails"
import type { AssignmentType } from "../types/assignmentTypes"
import { useParams, useSearchParams } from "react-router-dom"
import { api } from "../api"
import axios from "axios"
import type { ProjectRole } from "../types/projectTypes"
import ActionButtons from "../components/project_components/ActionButtonsComponent"

export default function Project () {

    const [assignments, setAssignments] = useState<AssignmentType[]>([])
    const [selectedAssignment, setSelectedAssignment] = useState<AssignmentType>()
    const [membership, setMembership] = useState<ProjectRole>("MEMBER");

    const { id } = useParams()

    const [searchParams] = useSearchParams();
    const title = searchParams.get("title");

     useEffect(() => {
        const getProjectAssignments = async () => {
            try {
                const response = await api.get(`/assignment/${id}`);
                setAssignments(response.data.assignments);
                setMembership(response.data.membership);
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

    return (
        <div className="flex justify-center min-h-screen text-black dark:text-white">
                <ActionButtons id={id} membership={membership}/>
            <div className="flex items-center">
                <div className="w-px bg-rose-400 dark:bg-rose-800 h-7/8"></div>
            </div>

            <div className="flex-2 mx-10 flex flex-col gap-10 my-10">
            <p className="font-semibold text-2xl"> Assignments </p>
            {assignments.length > 0 &&
                [...assignments]
                .sort((a, b) => {
                    const priority: Record<string, number> = {
                    IN_PROGRESS: 1,
                    TODO: 2,
                    DONE: 3
                    }
                    return (priority[a.status] || 99) - (priority[b.status] || 99)
                })
                .map((assignment) => (
                    <Assignment
                    key={assignment.id}
                    setDetails={setSelectedAssignment}
                    assignment={assignment}
                    />
                ))
            }
            </div>

            <div className="flex items-center">
                <div className="w-px bg-rose-400 dark:bg-rose-800 h-7/8"></div>
            </div>

            <div className="flex-3 mx-10 flex flex-col gap-10 my-10">
                <p className="font-semibold text-2xl"> Details </p>
                { selectedAssignment && <AssignmentDetails membership={membership} details={selectedAssignment} /> }          
            </div>
        </div>
    )
}