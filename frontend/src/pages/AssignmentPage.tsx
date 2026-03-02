import { useEffect, useState } from "react";
import type { AssignmentType } from "../types/assignmentTypes"
import { useNavigate, useParams } from "react-router-dom"
import { api } from "../api";
import axios from "axios";
import { useAuth } from "../hooks/authHook";
import { handleDecline, handleDelete, handleFinsih, handleProcess } from "../hooks/assignmentHook";
import type { ProjectRole } from "../types/projectTypes";

export default function AssignmentPage () {

    const [assignmentInfo, setAssignmentInfo] = useState<AssignmentType>()
    const [membership, setMembership] = useState<ProjectRole>('MEMBER')

    const { id, projectId } = useParams();
    const {user} = useAuth();
    const navigate = useNavigate();

    const isAssigned = assignmentInfo?.assignees.some(a => a.user.id === user?.id)

    useEffect(() => {
        const getInfo = async () => {
            try {
                const response = await api.get(`/assignment/${projectId}/info/${id}`);
                setAssignmentInfo(response.data.assignment);
                setMembership (response.data.membership);
            } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                console.log(backendMessage);
                
            } else {
                console.log("Unexpected error", err);
            }
            }
        } 
        getInfo()
    }, [projectId, id]);

    return (
        <div className="flex justify-center">
            <div className="flex flex-col items-center mt-10 dark:bg-slate-800 px-5 py-10 rounded-3xl w-1/2">
                <h1 className="text-3xl font-semibold"> {assignmentInfo?.title} </h1>
                <div className="flex flex-col items-center mt-10 text-2xl gap-10">
                    <p> {assignmentInfo?.description} </p>
                    <p className="bg-slate-700 p-5 rounded-3xl"> Due date: {assignmentInfo?.dueDate.split("T")[0]} </p>

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
                            <p className="font-semibold bg-slate-700 py-2 px-4 rounded-2xl text-center mx-1" key={assignee.id}> {assignee.user.username} </p>
                        ))
                    )}
                    </div>
                </div>
                <div className="flex w-2/3 items-center justify-center gap-5 mt-10">

                    { membership !== "MEMBER" && ( 
                        <button className="dark:bg-rose-700 active:dark:bg-rose-500 font-semibold p-3 w-1/4 rounded-2xl cursor-pointer"
                        onClick={() => {
                            handleDelete(assignmentInfo?.projectId, assignmentInfo?.id)
                            navigate('/');
                        }}
                        >
                            Delete
                        </button>
                    )}

                    { membership  !== "MEMBER" && assignmentInfo?.status !== "DONE" && (
                        <button className="dark:bg-rose-700 active:dark:bg-rose-500 font-semibold p-3 w-1/4 rounded-2xl cursor-pointer"
                        onClick={() =>  {
                            handleFinsih(assignmentInfo?.projectId, assignmentInfo?.id)
                            navigate('/');
                        }}
                        >
                            Complete
                        </button>
                    )}
                    
                    { membership !== "MEMBER" && assignmentInfo?.status === "IN_PROGRESS" && (
                        <button className="dark:bg-rose-700 active:dark:bg-rose-500 font-semibold p-3 w-1/4 rounded-2xl cursor-pointer"
                        onClick={() =>  {
                            handleDecline(assignmentInfo?.projectId, assignmentInfo?.id)
                            navigate('/');
                        }}
                        >
                            Decline
                        </button>
                    )}

                    { isAssigned && assignmentInfo?.status === "TODO" && (
                        <button className="dark:bg-rose-700 active:dark:bg-rose-500 font-semibold p-3 w-1/4 rounded-2xl cursor-pointer"
                        onClick={() => {
                            handleProcess(assignmentInfo?.projectId, assignmentInfo?.id)
                            navigate('/');
                        }}
                        >
                            set to progress
                        </button>
                    )}

                </div>

            </div>
        </div>
    )
}