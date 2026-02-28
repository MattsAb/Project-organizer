import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { api } from "../api"
import type { Member } from "../types/projectTypes"

export default function Members () {

    const [members, setMembers] = useState<Member[]>([])
    const [errorMessage, setErrorMessage] = useState('');

    const { id } = useParams()


    useEffect(() => {
        async function getMembers() {
        try {
                const response = await api.get(`members/${id}`)
                setMembers(response.data)
                
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

    return (
        <div className="flex mt-10">
            <div className="flex-2 flex flex-col items-center gap-5">
                <p className="font-bold text-3xl"> Project members</p>

                {members.length > 0 && (
                    members.map((member) => (
                        <button className="bg-slate-800 hover:bg-slate-700 py-3 rounded-2xl w-1/3 cursor-pointer flex justify-around items-center">
                           <p className="font-semibold text-2xl"> {member.user.username} </p>
                           <p className={`
                            ${ member.role === 'OWNER' &&'bg-rose-600'}
                            ${member.role === 'ADMIN' && 'bg-rose-300'}
                            ${member.role === 'MEMBER' && 'bg-slate-700'}
                            px-4 rounded-2xl`}> {member.role}</p>
                        </button>
                    ))
                )}
                {errorMessage ? <p className="text-red-500"> {errorMessage} </p> : <></>}
            </div>

            <div className="flex items-center h-screen">
                <div className="w-px bg-rose-400 dark:bg-rose-800 h-7/8"></div>
            </div>

            <div className="flex-1 flex text-2xl font-semibold justify-center">
                <p > Member information </p>
            </div>

        </div>
    )
}