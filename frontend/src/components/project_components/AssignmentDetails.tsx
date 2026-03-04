import type { AssignmentType } from "../../types/assignmentTypes";
import { useAuth } from "../../hooks/authHook";
import type { ProjectRole } from "../../types/projectTypes";
import AssignmentButtons from "../AssignmentButtons";
import { api } from "../../api";
import { useEffect, useState } from "react";
import axios from "axios";
import ErrorComponent from "../simple_components/ErrorComponent";

type InfoProps = {
    projectId: number
    assignmentId: number
    onChange: () => void
    setSelected: (empty: undefined) => void
}

export default function AssignmentDetails ({projectId, assignmentId, onChange, setSelected}: InfoProps) {
    const [assignmentInfo, setAssignmentInfo] = useState<AssignmentType>()
    const [membership, setMembership] = useState<ProjectRole>('MEMBER');
    const [errorMessage, setErrorMessage] = useState('');
    const {user} = useAuth();

    const isAssigned = assignmentInfo?.assignees.some(a => a.user.id === user?.id)

    const getInfo = async () => {
        try {
            const response = await api.get(`/assignment/${projectId}/info/${assignmentId}`);
            setAssignmentInfo(response.data.assignment);
            setMembership(response.data.membership)
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setErrorMessage(err.response?.data?.message ?? err.message);
                setSelected(undefined);
            } 
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/assignment/${projectId}/info/${assignmentId}`);
                setAssignmentInfo(response.data.assignment);
                setMembership(response.data.membership)
                setErrorMessage('');
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    setErrorMessage(err.response?.data?.message ?? err.message);
                }
            }
        };
        fetchData();
    }, [projectId, assignmentId]); 


    return (
        <div className="bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl flex flex-col items-center text-2xl font-semibold gap-10 text-center">
             { assignmentInfo && (
            <>
            <p className="font-semibold text-3xl"> {assignmentInfo.title} </p>
            <p className="text-2xl"> {assignmentInfo.description}</p>
            <p> Due by: {assignmentInfo.dueDate.split("T")[0]}</p>
            <div className="flex items-center gap-2 justify-center">
                <p> Status: </p>
                <p className={`${assignmentInfo.status === "DONE" && "bg-green-600"}
                ${assignmentInfo.status === "IN_PROGRESS" && `text-green-400`} px-3 py-2 rounded-2xl`}
                > 
                {assignmentInfo.status === "DONE"  && 'Completed'} 
                {assignmentInfo.status === "IN_PROGRESS" && 'Pending'}
                {assignmentInfo.status === "TODO" && 'In process'}
                </p>
             </div>

            <div className="flex flex-col items-center">
                <p className="mb-3">Assigned to:</p>
                <div className="flex"> 
                    {assignmentInfo?.assignees.map((assignee) => (
                        <p key={assignee.id} className="font-semibold bg-gray-300 dark:bg-slate-700 py-2 px-4 rounded-2xl text-center mx-1"> {assignee.user.username} </p>
                    ))}
                </div>
            </div>

            <ErrorComponent message={errorMessage}/>

            <div className="flex w-full items-center justify-center gap-5">
                <AssignmentButtons
                goBack={false}
                onSuccess={() => {
                    getInfo()
                    onChange()}}
                membership={membership}
                status={assignmentInfo.status}
                title={assignmentInfo.title}
                projectId={assignmentInfo.projectId}
                assignmentId={assignmentInfo.id}
                isAssigned={isAssigned !== undefined && isAssigned}
                />  
            </div>
            </>)}
        </div>
    )
}