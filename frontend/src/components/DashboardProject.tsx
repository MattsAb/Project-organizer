import type { DashboardProjectType } from "../types/projectTypes"

export default function DashboardProject({
  title,
  description,
  assignments
}: DashboardProjectType) {

  const visibleAssignments = assignments.slice(0, 3)
  const remainingCount = assignments.length - 3

  return (
    <div className="bg-slate-200 dark:bg-slate-800 p-5 rounded-3xl flex items-stretch gap-10 mx-10 my-5">

      <div className="flex flex-col bg-slate-300 dark:bg-slate-700 flex-2 p-5 rounded-2xl justify-around items-center ">
        <p className="font-semibold text-2xl">{title}</p>
        <p className="text-2xl">{description}</p>
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <p className="font-semibold"> pending </p>
        {visibleAssignments.map((assignment, index) => (
          <button
            key={index}
            className="bg-slate-300 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex flex-col gap-2 p-3 rounded-2xl cursor-pointer"
            onClick={() => console.log(assignment)}
          >
            <p>{assignment.title}</p>
            <p>by: {assignment.assignees[0]?.user.username} {assignment.assignees.length > 1 && `and +${assignment.assignees.length - 1}  more`}</p>
          </button>
        ))}

        {remainingCount > 0 && (
          <div className="text-s">
            +{remainingCount} more
          </div>
        )}
      </div>

    </div>
  )
}