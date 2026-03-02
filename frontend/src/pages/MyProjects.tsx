import { useEffect, useState } from "react";
import MyProject from "../components/MyProjectComponent";
import axios from "axios";
import { api } from "../api";
import type { MyProjectType } from "../types/projectTypes";


export default function MyProjects () {

    const [myProjects, setMyProjects] = useState<MyProjectType[]>([])
    const [memberProjects, setMemberProjects] = useState<MyProjectType[]>([])
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const getUserProjects = async () => {
            try {
                const response = await api.get(`/userprojects`);
                setMyProjects(response.data.myProjects);
                setMemberProjects(response.data.memberProjects);
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
                    canDelete={true}
                    projectInfo={project}
                />
                ))
                )}
            </div>

            <div className="flex items-center w-screen justify-center">
                <div className="h-px bg-rose-400 dark:bg-rose-800 w-1/2"></div>
            </div>

            <p className="font-bold text-3xl mt-5"> Projects you are a part of</p>

            <div className="w-1/2 flex flex-col gap-5 mb-10">
                {memberProjects.length > 0 && (
               memberProjects.map((project) => (
                <MyProject
                    key={project.id}
                    canDelete={false}
                    projectInfo={project}
                />
                ))
                )}
            </div>
        </div>
    )
}