import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/authHook";
import type { NotificationsType } from "../types/inviteTypes";

type ExtraButtonsProps = {
    open: boolean
    id: number
    notifications: NotificationsType | undefined
}

export default function ExtraButtons({ open, id, notifications }: ExtraButtonsProps) {

    const {logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth')
    }
    const goToInvites = () => navigate(`/invites/${id}`)
    const goToMessages = () => navigate(`/messages`)

    return (
        open && (
            <div className="absolute top-14 right-4 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-3 z-50 flex flex-col gap-2">
                <button
                    onClick={goToMessages}
                    className=" w-full py-2 hover:bg-slate-20  dark:hover:bg-slate-700 px-3 text-left rounded-lg cursor-pointer flex justify-between"
                >
                    Messages
                    {notifications?.messages !== 0 && <p> {notifications?.messages} </p>}
                </button>

                <button
                    onClick={goToInvites}
                    className=" w-full py-2 hover:bg-slate-20  dark:hover:bg-slate-700 px-3 text-left rounded-lg cursor-pointer flex justify-between"
                >
                    Invites
                    {notifications?.invites !== 0 && <p> {notifications?.invites} </p>}
                </button>
                

                <button
                    onClick={handleLogout}
                    className="block w-full py-2 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 text-left rounded-lg cursor-pointer"
                >
                    Logout
                </button>
            </div>
        )
    )
}