import { useEffect, useState } from "react"
import axios from "axios"
import { api } from "../api"
import type { User } from "../types/authTypes"
import InviteButton from "../components/InviteButton"
import { useParams } from "react-router-dom"

export default function Members () {

    const [users, setUsers] = useState<User[]>([]);
    const [input, setInput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const { id } = useParams()

    useEffect(() => {
        async function getUsers() {
        try {
                const response = await api.get(`/users/${id}`)
                setUsers(response.data)
                
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                console.log(backendMessage);
                setErrorMessage(backendMessage);
                } else 
                {
                console.log("Unexpected error", err);
                setErrorMessage("Unexpected error");
                }
            }
        }

        getUsers()
    },[id])

    async function handleSearch () {

        if (input === "") return;
        
        try {
            const response = await api.get(`/search`, {
                params: { search: input }
            })
            setUsers(response.data)
            
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
            const backendMessage = err.response?.data?.message ?? err.message;
            console.log(backendMessage);
            setErrorMessage(backendMessage);
            } else 
            {
            console.log("Unexpected error", err);
            setErrorMessage("Unexpected error");
            }
        }
    }

    return (
        <div className="flex mt-10 items-center justify-center">
            <div className="flex flex-col items-center gap-5 w-1/4">
                <p className="font-bold text-3xl"> Search</p>
                <div className="w-full flex items-center gap-3">
                    <input className="dark:bg-slate-800 bg-gray-200 p-2 rounded-2xl w-full"
                    placeholder="Search users..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="dark:bg-slate-700 active:dark:bg-slate-600  bg-gray-200 active:bg-gray-300 px-4 py-2 rounded-2xl cursor-pointer"
                    onClick={handleSearch}>
                        Search
                    </button>
                </div>

                {users.length > 0 && (
                    users.map((user) => (
                        <InviteButton 
                        key={user.id}
                        id={user.id}
                        projectId={id}
                        username={user.username}
                        />
                    ))
                )}
            </div>
            {errorMessage ? <p className="text-red-500"> {errorMessage} </p> : <></>}
        </div>
    )
}