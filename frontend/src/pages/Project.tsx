import { useEffect, useState } from "react"
import Assignment from "../components/project_components/Assignment"
import AssignmentDetails from "../components/project_components/AssignmentDetails"
import type { AssignmentType } from "../types/assignmentTypes"
import { useParams, useSearchParams } from "react-router-dom"
import { api } from "../api"
import axios from "axios"
import type { ProjectRole } from "../types/projectTypes"
import ActionButtons from "../components/project_components/ActionButtonsComponent"
import ErrorComponent from "../components/simple_components/ErrorComponent"

type ProjectProps = {
  setTitle: (title: string) => void
};

export default function Project ({setTitle}: ProjectProps) {

    const [assignments, setAssignments] = useState<AssignmentType[]>([])
    const [selectedAssignment, setSelectedAssignment] = useState<AssignmentType>()
    const [membership, setMembership] = useState<ProjectRole>("MEMBER");
    const [errorMessage, setErrorMessage] = useState('');

    const { id } = useParams()

    const [searchParams] = useSearchParams();

    const title = searchParams.get("title");

            const getProjectAssignments = async () => {
            try {
                const response = await api.get(`/assignment/${id}`);
                setAssignments(response.data.assignments);
                setMembership(response.data.membership);
                setErrorMessage('');
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const backendMessage = err.response?.data?.message ?? err.message;
                    setErrorMessage(backendMessage);
                    console.log(backendMessage);
                } else {
                    console.log("Unexpected error", err);
                }
            }
        } 

     useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/assignment/${id}`);
                setAssignments(response.data.assignments);
                setMembership(response.data.membership);
                setErrorMessage('');
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const backendMessage = err.response?.data?.message ?? err.message;
                    setErrorMessage(backendMessage);
                    console.log(backendMessage);
                } else {
                    console.log("Unexpected error", err);
                }
            }
        } 
        fetchData()
        }, [id]);

    useEffect(() => {
        if (!title) return
        setTitle(title)

        return () => {
            setTitle("");
        };
    })

    return (
        <div className="flex justify-center min-h-screen text-black dark:text-white ">
            <ActionButtons id={id} membership={membership} title={title ? title : ""}/>

            <div className="flex-2 mx-10 flex flex-col gap-5 my-10  min-w-75">

            <p className="font-semibold text-2xl"> Assignments </p>
            {assignments.length > 0 &&
                assignments.map((assignment) => (
                    <Assignment
                    key={assignment.id}
                    setDetails={setSelectedAssignment}
                    assignment={assignment}
                    />
                ))
            }
            <ErrorComponent message={errorMessage}/>

            </div>

            <div className="hidden lg:flex flex-col flex-2 gap-10 mx-10 my-10 min-w-100">
                <p className="font-semibold text-2xl"> Details </p>
                { selectedAssignment && <AssignmentDetails  
                projectId={selectedAssignment.projectId} 
                assignmentId={selectedAssignment.id}
                setSelected={setSelectedAssignment}
                onChange={getProjectAssignments}
                /> }          
            </div>

        </div>
    )
}