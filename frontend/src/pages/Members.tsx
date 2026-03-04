import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { api } from "../api"
import type { MemberType, ProjectRole } from "../types/projectTypes"
import { useAuth } from "../hooks/authHook"
import ConfirmationModal from "../components/simple_components/ConfirmationModal"
import ErrorComponent from "../components/simple_components/ErrorComponent"

export default function Members () {

    const [members, setMembers] = useState<MemberType[]>([]);
    const [selecetedMember, setSelectedMember] = useState<MemberType>();
    const [open, setOpen] = useState(false);
    const [membership, setMembership] = useState<ProjectRole>('MEMBER');
    const [errorMessage, setErrorMessage] = useState('');

    const {user} = useAuth();

    const navigate = useNavigate();

    const { id } = useParams();

    useEffect(() => {
        async function getMembers() {
        try {
            const response = await api.get(`members/${id}`)
            setMembers(response.data.members)
            setMembership(response.data.membership)
            setErrorMessage('')
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                setErrorMessage(backendMessage);
            } else 
            {
                console.log("Unexpected error", err);
                setErrorMessage("Unexpected error");
            }
            }
        }
        getMembers()
    },[id])

    async function handleRoleChange (memberId: number) {
        try {
            await api.put(`/${id}/members/${memberId}/role`)
            changeRole(memberId)
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                setErrorMessage(backendMessage);
            } else 
            {
                console.log("Unexpected error", err);
                setErrorMessage("Unexpected error");
            }
        }

    }

    const changeRole = (memberId: number) => {
        setMembers(prev => prev.map(m => 
            m.id === memberId 
                ? { ...m, role: m.role === 'MEMBER' ? 'ADMIN' : 'MEMBER' } 
                : m
        ))
        setSelectedMember(prev => 
            prev?.id === memberId 
                ? { ...prev, role: prev.role === 'MEMBER' ? 'ADMIN' : 'MEMBER' } 
                : prev
        )
    }

    async function handleKick(memberId: number) {
        try {
            await api.delete(`/${id}/members/${memberId}/kick`)
            setMembers(prev => prev.filter(m => m.id !== memberId))
            if (selecetedMember?.id === memberId) setSelectedMember(undefined)
            setOpen(false)
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                setErrorMessage(backendMessage);
            } else {
                console.log("Unexpected error", err);
                setErrorMessage("Unexpected error");
            }
        }
    }

    const goToMessage = () => {
    if (!selecetedMember) return;
    navigate(
        `/message/${selecetedMember.user.id}?name=${encodeURIComponent(
        selecetedMember.user.username
        )}`
    );
    };

    return (
        <div className="flex mt-10">
            <div className="flex-2 flex flex-col items-center gap-5">
                <p className="font-bold text-3xl"> Project members</p>

                {members.length > 0 && (
                    members.map((member) => (
                        <button className="bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 py-3 rounded-sm w-1/3 cursor-pointer flex justify-around items-center"
                        key={member.id}
                        onClick={() => setSelectedMember(member)}
                        >
                           <p className="font-semibold text-2xl"> {member.user.username} </p>
                           <p className={`
                            ${ member.role === 'OWNER' &&'bg-rose-600'}
                            ${member.role === 'ADMIN' && 'bg-rose-400'}
                            ${member.role === 'MEMBER' && 'dark:bg-slate-700 bg-gray-300'}
                            px-4 rounded-2xl`}> {member.role}</p>
                        </button>
                    ))
                )}
                <ErrorComponent message={errorMessage}/>
            </div>

            <div className="flex items-center h-screen">
                <div className="w-px bg-rose-400 dark:bg-rose-800 h-7/8"></div>
            </div>

            <div className="flex-1 flex flex-col items-center">
                <p className="font-semibold text-3xl"> Member information </p>
                {selecetedMember && (
                    <div className="flex flex-col gap-10 mt-10 items-center text-2xl bg-gray-50 dark:bg-slate-800 py-8 px-16 rounded-xl">
                        <p> {selecetedMember.user.username} </p>
                        <p> Joined at: {selecetedMember.joinedAt.split("T")[0]} </p>
                        <p> Role: {selecetedMember.role} </p>

                        { user?.id !== selecetedMember.user.id &&
                        <button className="dark:bg-slate-700 bg-gray-200 py-2 px-4 rounded-sm cursor-pointer"
                        onClick={goToMessage}>
                            Message
                        </button>
                        }

                       { membership !== "MEMBER" && selecetedMember.role !== "OWNER" && user?.id !== selecetedMember.user.id && (
                        <div className="flex flex-col gap-10">
                            <button className="dark:bg-slate-700 bg-gray-200 py-2 px-4 rounded-sm cursor-pointer"
                            onClick={() => handleRoleChange(selecetedMember.id)}
                            > {selecetedMember.role === "MEMBER" ? "Promote to Admin" : "Demote to Member"} </button>
                            <button className="dark:bg-rose-700 bg-rose-400 py-2 px-4 rounded-sm cursor-pointer"
                            onClick={() => setOpen(true)}
                            >
                                Kick
                            </button>
                        </div>
                        )}
                        
                    </div>
                )}
            </div>
                <ConfirmationModal 
                context="Kick" 
                title={selecetedMember ? selecetedMember?.user.username : ""} 
                onConfirm={() => {
                    if (!selecetedMember) return
                    handleKick(selecetedMember.id)}} 
                onClose={() => setOpen(false)} 
                open={open}/>
        </div>
    )
}