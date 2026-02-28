import { useEffect, useState } from "react"
import axios from "axios"
import { api } from "../api"
import type { User } from "../types/authTypes"
import InviteButton from "../components/InviteButton"
import { useParams } from "react-router-dom"

export default function Members () {

    const [users, setUsers] = useState<User[]>([])
    const [errorMessage, setErrorMessage] = useState('');

    const { id } = useParams()

    useEffect(() => {
        async function getUsers() {
        try {
                const response = await api.get(`/users`)
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
    },[])

    return (
        <div className="flex mt-10">
            <div className="flex-2 flex flex-col items-center gap-5">
                <p className="font-bold text-3xl"> Users</p>

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