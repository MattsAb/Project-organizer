import { HomeIcon, PlusIcon, Squares2X2Icon } from "@heroicons/react/24/solid"
import { useNavigate } from "react-router-dom"

type SidebarProps = {
  isExpanded: boolean
  onClose: () => void;
}

export default function Sidebar({ isExpanded, onClose }: SidebarProps) {
  const navigate = useNavigate()

  const navItems = [
    { label: "Home", icon: HomeIcon, path: "/" },
    { label: "Create project", icon: PlusIcon, path: "/create" },
    { label: "My projects", icon: Squares2X2Icon, path: "/myprojects" },
  ]

  return (
<div className={`fixed right-0 left-0 bottom-0 top-0 lg:bg-black/0 z-40 ${isExpanded ? 
'bg-black/60 pointer-events-auto lg:pointer-events-none' : 
'pointer-events-none' }`}
onClick={onClose}
>
<div
  className={`
    fixed top-18 self-start h-full pointer-events-auto z-50
    dark:bg-slate-800 border-r-2 border-gray-300 dark:border-slate-900 bg-white
    text-black dark:text-white
    transition-all duration-300
    ${isExpanded ? "w-64 px-4" : "w-16 px-2 hidden md:block"}
    flex flex-col
    z-30
  `}
  onClick={(e) => e.stopPropagation()}
>
      <div className="flex flex-col gap-5 my-5 bg-gray-100 dark:bg-slate-900 rounded-sm py-4">
        {navItems.map(({ label, icon: Icon, path }) => (
          <button
            key={label}
            onClick={() => {
              navigate(path)
              onClose();
            }}
            className={`
              flex items-center cursor-pointer
              hover:bg-slate-200 active:bg-slate-300
              dark:hover:bg-slate-700 dark:active:bg-slate-600
               font-semibold
              rounded-2xl ${isExpanded && "mx-2" } px-2 py-2
              overflow-hidden`}
            
          >
            <Icon className="h-8 w-8 shrink-0" />

            <span
              className={`
                ml-3 whitespace-nowrap
                transition-all duration-200
              `}
            >
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
    </div>
  )
}