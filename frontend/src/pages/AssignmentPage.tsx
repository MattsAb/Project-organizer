import {  useEffect, useState } from "react";
import type { AssignmentType } from "../types/assignmentTypes"
import { useParams } from "react-router-dom"
import { api } from "../api";
import axios from "axios";
import { useAuth } from "../hooks/authHook";
import type { ProjectRole } from "../types/projectTypes";
import ErrorComponent from "../components/simple_components/ErrorComponent";
import AssignmentButtons from "../components/AssignmentButtons";

export default function AssignmentPage () {

    const [assignmentInfo, setAssignmentInfo] = useState<AssignmentType>();
    const [membership, setMembership] = useState<ProjectRole>('MEMBER');
    const [errorMessage, setErrorMessage] = useState('');

    const { id, projectId } = useParams();
    const {user} = useAuth();

    const isAssigned = assignmentInfo?.assignees.some(a => a.user.id === user?.id)

    const getInfo = async () => {
        try {
            const response = await api.get(`/assignment/${projectId}/info/${id}`);
            setAssignmentInfo(response.data.assignment);
            setMembership(response.data.membership);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                setErrorMessage(backendMessage);
            } else {
                console.log("Unexpected error", err);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/assignment/${projectId}/info/${id}`);
                setAssignmentInfo(response.data.assignment);
                setMembership(response.data.membership);
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setErrorMessage(err.response?.data?.message ?? err.message);
                }
            }
        };

        fetchData();
    }, [projectId, id]); 

    return (
        <div className="flex justify-center">
            { assignmentInfo &&
            <div className="flex flex-col items-center mt-10 dark:bg-slate-800 bg-gray-200 px-5 py-10 rounded-xl md:w-1/2 w-2/3">
                <h1 className="text-3xl font-semibold wrap-break-word w-full text-center"> {assignmentInfo?.title} </h1>
                <div className="flex flex-col items-center mt-10 text-2xl gap-10 w-full">
                    <p className="max-w-[90%] wrap-break-word"> {assignmentInfo?.description} </p>
                    <p className="dark:bg-slate-700 bg-gray-300 p-5 rounded-3xl"> Due date: {assignmentInfo?.dueDate.split("T")[0]} </p>

                <div className="flex items-center gap-2 justify-center">
                    <p> Status: </p>
                    <p className={`${assignmentInfo?.status === "DONE" && "bg-green-600"}
                    ${assignmentInfo?.status === "IN_PROGRESS" && `text-green-400`} px-3 py-2 rounded-2xl`}
                    > 
                    {assignmentInfo?.status === "DONE"  && 'Completed'} 
                    {assignmentInfo?.status === "IN_PROGRESS" && 'Pending'}
                    {assignmentInfo?.status === "TODO" && 'In process'}
                    </p>
                </div>

                    <p> Assigned to:</p>
                    <div className="flex items-center">
                    {assignmentInfo?.assignees.length !== 0 && (
                        assignmentInfo?.assignees.map((assignee) => (
                            <p className="font-semibold bg-gray-300 dark:bg-slate-700 py-2 px-4 rounded-2xl text-center mx-1" key={assignee.id}> {assignee.user.username} </p>
                        ))
                    )}
                    </div>
                </div>

                <div className="flex w-2/3 items-center justify-center gap-5 mt-10 flex-col md:flex-row min-w-full">
                    <AssignmentButtons
                    goBack={true}
                    onSuccess={getInfo}
                    membership={membership}
                    status={assignmentInfo.status}
                    title={assignmentInfo.title}
                    projectId={assignmentInfo.projectId}
                    assignmentId={assignmentInfo.id}
                    isAssigned={isAssigned !== undefined && isAssigned}
                    />
                </div>

            </div>}
            <ErrorComponent message={errorMessage}/>
        </div>
    )
}