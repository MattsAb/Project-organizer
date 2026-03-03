import { Bars3Icon } from '@heroicons/react/16/solid';
import { useNavigate } from "react-router-dom";
import ExtraButtons from "./simple_components/ExtraButtons";
import { useEffect, useRef, useState } from "react";
import type { User } from "../types/authTypes";
import type { NotificationsType } from "../types/inviteTypes";

type HeaderProps = {
    setIsExpanded: () => void;
    user?: User | null
    notifications: NotificationsType | undefined
    title: string
}

export default function Header ({setIsExpanded, user, notifications, title}: HeaderProps) {

    const [open, setOpen] = useState(false)

    const ref = useRef<HTMLDivElement | null>(null);

    const navigate = useNavigate();
    const goToAuth = () => navigate('/auth');

    const totalNotifications =
    (notifications?.invites ?? 0) +
    (notifications?.messages ?? 0);

    useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        if (!ref.current?.contains(e.target as Node)) {
            setOpen(false)
        }
    }

  document.addEventListener("mousedown", handleClick)
  return () => document.removeEventListener("mousedown", handleClick)
}, [])

    return (
        <div className="bg-white dark:bg-slate-800  fixed left-0 right-0 h-18 border-b-2 dark:border-slate-900 border-gray-300 flex dark:text-white text-black z-30">
            <div className="w-full flex items-center ">
                <button className=" active:bg-gray-200 dark:active:bg-slate-700 rounded-full p-2 mx-2 cursor-pointer"
                onClick={setIsExpanded}
                >
                    <Bars3Icon className="h-8 w-8"/>
                </button>
            </div>

            <div className="w-full flex items-center">
                <h1 className='font-bold text-3xl'> {title} </h1>
            </div>

            {user ? (
            <div className="w-full flex  items-center justify-end relative">
                <div ref={ref}>
                    <button className="cursor-pointer"
                    onClick={() => {setOpen(!open)

                    }}
                    >
                        <p className="font-semibold text-xl mx-4 py-1 px-2 rounded-2xl"> {user.username} </p>
                    </button>
                    {!open && totalNotifications > 0 &&  <p className="absolute right-2 top-2 bg-red-600 border-2 border-white dark:border-slate-800 px-2 rounded-full text-white"> {totalNotifications} </p>}
                    <ExtraButtons open={open} id={user.id} notifications={notifications}/> 
                </div>
            </div>) : (
                
            <button className="w-full flex items-center justify-end cursor-pointer"
            onClick={goToAuth}
            >
                <p className="font-semibold text-xl mx-4 py-1 px-2 rounded-2xl text-white"> Sign In </p>
            </button>
            )}

        </div>
    )
}