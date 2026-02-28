import { useEffect, useState } from "react";
import MyProject from "../components/MyProjectComponent";
import type { Project } from "../types/projectTypes";
import axios from "axios";
import { api } from "../api";

type MyProjectType = Project & {
  _count: {
    members: number
    assignments: number
  }
}

export default function MyProjects () {

    const [myProjects, setMyProjects] = useState<MyProjectType[]>([])
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getUserProjects = async () => {
            try {
                const response = await api.get(`/userprojects`);
                setMyProjects(response.data);
            } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                console.log(backendMessage);
                setErrorMessage(backendMessage);

            } else {
                console.log("Unexpected error", err);
                setErrorMessage("Unexpected error");
                console.log(errorMessage)
            }
            }
        } 
        getUserProjects()
  }, [errorMessage]);

    return (
        <div className="flex flex-col items-center gap-10 w-full">
            <p className="font-bold text-3xl mt-5"> My projects </p>
            <div className="w-1/2 flex flex-col gap-5">
                {myProjects.length > 0 && (
               myProjects.map((project) => (
                <MyProject
                    key={project.id}
                    id={project.id}
                    title={project.title}
                    description={project.description}
                    numberOfAssignments={project._count.assignments}
                    numberOfMembers={project._count.members}
                />
                ))
                )}
            </div>
        </div>
    )
}