import { HomeIcon, PlusIcon, Squares2X2Icon } from "@heroicons/react/24/solid"
import { useNavigate } from "react-router-dom"

type SidebarProps = {
  isExpanded: boolean
}

export default function Sidebar({ isExpanded }: SidebarProps) {
  const navigate = useNavigate()

  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "Create project", icon: PlusIcon, path: "/create" },
    { label: "My projects", icon: Squares2X2Icon, path: "/myprojects" },
  ]

  return (
    <div
      className={`
        fixed top-18 left-0 bottom-0
         dark:bg-slate-800 border-r-2 border-gray-300 dark:border-slate-900 bg-white
         text-black dark:text-white
        transition-all duration-300
        ${isExpanded ? "w-64 px-4" : "w-16 px-2 hidden md:block"}
        flex flex-col
        z-30
      `}
    >
      <div className="flex flex-col gap-5 my-5 bg-gray-100 dark:bg-slate-900 rounded-sm py-4">
        {navItems.map(({ label, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`
              flex items-center
              hover:bg-slate-200 active:bg-slate-300
              dark:hover:bg-slate-700 dark:active:bg-slate-600
               font-semibold
              rounded-2xl ${isExpanded && "mx-2" } px-2 py-2
              transition-colors
              overflow-hidden`}
            
          >
            <Icon className="h-8 w-8 shrink-0" />

            <span
              className={`
                ml-3 whitespace-nowrap
                transition-all duration-200
                ${isExpanded ? "opacity-100" : "opacity-0 w-0"}
              `}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}