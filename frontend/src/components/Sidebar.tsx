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
        bg-rose-300 dark:bg-rose-900 border-r-2 border-rose-400 dark:border-rose-600
        transition-all duration-300
        ${isExpanded ? "w-64 px-4" : "w-16 px-2"}
        flex flex-col
        z-30
      `}
    >
      <div className="flex flex-col gap-5 my-5 bg-rose-400 dark:bg-rose-600 rounded-3xl py-4">
        {navItems.map(({ label, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className={`
              flex items-center
              hover:bg-rose-500 active:bg-rose-400
              text-white font-semibold
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