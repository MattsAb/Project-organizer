import { useNavigate } from "react-router-dom";
import type { DashboardProjectType } from "../../types/projectTypes"

export default function DashboardProject({
  id,
  title,
  description,
  assignments,
}: DashboardProjectType) {

  const navigate = useNavigate();

  const goToAssignment = (assignmentId: number, projectId: number) => navigate(`/${projectId}/assignment/${assignmentId}`)
  const goToProject = (projectId: number) => navigate(`/project/${projectId}?title=${encodeURIComponent(title)}`) 


  const visibleAssignments = assignments.slice(0, 3)
  const remainingCount = assignments.length - 3

  return (
    <div className="bg-gray-200 dark:bg-slate-800 p-5 rounded-3xl flex items-stretch gap-10 mx-10 my-5">

      <button className="flex flex-col bg-gray-300 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 flex-2 p-5 rounded-2xl justify-around items-center cursor-pointer"
      onClick={() => goToProject(id)}
      >
        <p className="font-semibold text-2xl">{title}</p>
        <p className="text-2xl">{description}</p>
      </button>

      <div className="flex flex-col gap-2 flex-1">
        <p className="font-semibold"> pending </p>
        {visibleAssignments.map((assignment, index) => (
          <button
            key={index}
            className="bg-gray-300 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 flex flex-col gap-2 p-3 rounded-2xl cursor-pointer"
            onClick={() => goToAssignment(assignment.id, id)}
          >
            <p>{assignment.title}</p>
            <p>by: {assignment.assignees[0]?.user.username} {assignment.assignees.length > 1 && `and +${assignment.assignees.length - 1}  more`}</p>
          </button>
        ))}

        {remainingCount > 0 && (
          <div className="text-s">
            + {remainingCount} more
          </div>
        )}
      </div>

    </div>
  )
}