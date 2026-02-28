import { MagnifyingGlassIcon } from "@heroicons/react/16/solid"
import { Bars3Icon } from '@heroicons/react/16/solid';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authHook";

type HeaderProps = {
    setIsExpanded: () => void;
    username?: string
}

export default function Header ({setIsExpanded, username}: HeaderProps) {

    const navigate = useNavigate();
    const {logout} = useAuth();

    const goToAuth = () => navigate('/auth');
    const handleLogout = () => {
        logout();
        navigate('/auth')
    }

    return (
        <div className="dark:bg-rose-900 bg-rose-300 fixed left-0 right-0 h-18 border-b-2 dark:border-rose-600 border-rose-400 flex justify-between dark:text-white text-black z-30">
            <div className="w-full flex items-center">
                <button className="bg-rose-400 dark:bg-rose-600 active:bg-rose-200 dark:active:bg-rose-400 rounded-full p-2 mx-2 cursor-pointer"
                onClick={setIsExpanded}
                >
                    <Bars3Icon className="h-8 w-8 text-white"/>
                </button>
            </div>

            <div className="w-full flex items-center">
                <input className="flex-1 bg-amber-50 px-2 h-10 mx-2 rounded-3xl focus:outline-none focus:ring-3 focus:ring-rose-500 text-black"/>
                <button className="px-2 h-10 bg-rose-400 dark:bg-rose-600 active:bg-rose-200 dark:active:bg-rose-400 text-white rounded-full mx-2 cursor-pointer">
                    <MagnifyingGlassIcon className="h-6 w-6"/>
                </button>
            </div>
            {username ? (
            <button className="w-full flex items-center justify-end cursor-pointer"
            onClick={handleLogout}
            >
                <p className="font-semibold text-xl mx-4 py-1 px-2 rounded-2xl text-white"> {username} </p>
            </button>) : (
            <button className="w-full flex items-center justify-end cursor-pointer"
            onClick={goToAuth}
            >
                <p className="font-semibold text-xl mx-4 py-1 px-2 rounded-2xl text-white"> Sign In </p>
            </button>
            )}

        </div>
    )
}