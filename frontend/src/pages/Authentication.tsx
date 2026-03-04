import { useState } from "react";
import { useAuth } from "../hooks/authHook";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function Authentication () {
    
    const [isRegistered, setIsRegistered] = useState(false)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const {login} = useAuth();

    async function handleAuth() {
            try {
                    const endpoint = isRegistered ? "login" : "register";
                    const response = await api.post(`/auth/${endpoint}`, {
                    username,
                    password,
                    email
                    });
                    await login(response.data.token);
                    navigate('/');
                    window.location.reload();
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                    const backendMessage = err.response?.data?.message ?? err.message;
                    console.log(backendMessage);
                    setErrorMessage(backendMessage);

                } else {
                    console.log("Unexpected error", err);
                    setErrorMessage("Unexpected error");
                }
            }
    }
    return (
        <div className="flex flex-col items-center text-black dark:text-white">

            <h1 className="font-bold text-3xl my-5">{isRegistered ? 'Log In' : 'Sign Up'}</h1>
            
            <div className="w-full max-w-2xl flex flex-col gap-8">
                <div className="flex flex-col gap-8 w-full max-w-2xl rounded-xl bg-gray-50 dark:bg-slate-800 p-10">
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                        className="bg-slate-100 dark:bg-slate-700 rounded-xl border border-black dark:border-slate-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="bg-slate-100 dark:bg-slate-700 rounded-xl border border-black dark:border-slate-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    { !isRegistered &&
                    <input
                        type='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="youremail@gmail.com"
                        className="bg-slate-100 dark:bg-slate-700 rounded-xl border border-black dark:border-slate-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />}
                    {errorMessage ? <p className="text-red-500"> {errorMessage} </p> : <></>}

                </div>

                <button className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 dark:bg-rose-600 dark:hover:bg-rose-700 dark:active:bg-rose-800 py-3 rounded-xl font-semibold"
                onClick={handleAuth}>
                    {isRegistered ? 'Log In' : 'Sign Up'}
                </button>

                <div className="flex gap-1">
                    <p> {isRegistered ? "don't have an account?" : 'already have an account?'}</p>
                    <button className="cursor-pointer text-blue-500 active:text-blue-300 hover:text-blue-400"
                    onClick={() => setIsRegistered(!isRegistered)}>
                        {isRegistered ? 'Sign Up' : "Log In"}
                    </button>
                </div>

            </div>
        </div>
    )
}