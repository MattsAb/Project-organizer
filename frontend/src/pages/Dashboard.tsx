import { useEffect, useState } from "react";
import DashboardProject from "../components/dashboard_components/DashboardProject";

import type { DashboardProjectType } from "../types/projectTypes";
import DashboardAssignment from "../components/dashboard_components/DashboardAssignment";
import axios from "axios";
import { api } from "../api";
import type { AssignmentType } from "../types/assignmentTypes";
import ErrorComponent from "../components/simple_components/ErrorComponent";

export default function Dashboard() {

  const [projects, setProjects] = useState<DashboardProjectType[]>([]);
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

      useEffect(() => {
        const getProjects = async () => {
            try {
                const response = await api.get(`/`);
                setProjects(response.data.projects);
                setAssignments(response.data.assignments)
                setErrorMessage('');
            } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                setErrorMessage(backendMessage)
                console.log(backendMessage);
              } else {
                  console.log("Unexpected error", err);
              }
            }
        } 
        getProjects()
  }, []);

  return (
    <div className="flex justify-center min-h-screen text-black dark:text-white">

      <div className="flex-2">

          <p className="font-semibold text-3xl flex items-center justify-center my-5">Pending Projects</p>
          <ErrorComponent message={errorMessage}/>
          {errorMessage === "" && projects.length === 0 && <p className="flex items-center justify-center"> No updates </p>}
          <div className="flex flex-col w-full">
              {projects.length > 0 && (
                projects.map((project) => (
                  <DashboardProject key={project.id} {...project}/>
                ))
              )}
          </div>
      </div>

      { assignments.length > 0 && (
      <div className="flex flex-1">

        <div className="flex items-center">
          <div className="w-px bg-rose-400 dark:bg-rose-600 h-7/8"></div>
        </div>

        <div className="flex-1">

            <p className="font-semibold text-3xl flex items-center justify-center my-5">To do assignments</p>
  
            <div className="mx-10">
                {assignments.length > 0 && (
                  assignments.map((assignment) => (
                    <DashboardAssignment key={assignment.id} {...assignment}/>
                  ))
                )}
                
            </div>

        </div>
        
      </div>)}

    </div>
  )
}