import { useEffect, useState } from "react";
import DashboardProject from "../components/DashboardProject";

import type { DashboardProjectType } from "../types/projectTypes";
import DashboardAssignment from "../components/DashboardAssignment";
import axios from "axios";
import { api } from "../api";
import type { AssignmentType } from "../types/assignmentTypes";

export default function Dashboard() {

  const [projects, setProjects] = useState<DashboardProjectType[]>([]);
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);

      useEffect(() => {
        const getProjects = async () => {
            try {
                const response = await api.get(`/`);
                setProjects(response.data.projects);
                setAssignments(response.data.assignments)
            } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
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
        <div className="bg-slate-200 dark:bg-slate-700 m-10 flex items-center justify-center p-3 rounded-3xl">
          <p className="font-semibold text-2xl">Pending Projects</p>
        </div>
          <div className="flex flex-col w-full">
              {projects.length > 0 && (
                projects.map((project) => (
                  <DashboardProject key={project.id} {...project}/>
                ))
              )}
          </div>
      </div>

      <div className="flex items-center">
        <div className="w-px bg-rose-400 dark:bg-rose-600 h-7/8"></div>
      </div>

      <div className="flex-1">
          <div className="bg-slate-200 dark:bg-slate-700 m-10 flex items-center justify-center p-3 rounded-3xl">
            <p className="font-semibold text-2xl">To do assignments</p>
          </div>
          <div className="mx-10">
              {assignments.length > 0 && (
                assignments.map((assignment) => (
                  <DashboardAssignment key={assignment.id} {...assignment}/>
                ))
              )}
              
          </div>

      </div>

    </div>
  )
}