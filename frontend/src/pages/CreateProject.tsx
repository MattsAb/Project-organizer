import { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateProject () {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleCreate = async () => {
        try {
          await api.post(`/create`, {
            title: title,
            description: description,
          })

          navigate('/myprojects');
          
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
              const backendMessage = err.response?.data?.message ?? err.message;
              console.log(backendMessage);
              setErrorMessage(backendMessage);
            } else 
            {
              console.log("Unexpected error", err);
              setErrorMessage("Unexpected error");
              console.log(errorMessage)
            }
        }
    }

 return (

    <div className="flex flex-col items-center gap-10 px-4 py-10 text-black dark:text-white">

      <h1 className="text-3xl font-bold">Create a Project</h1>

      <div className="w-full max-w-2xl flex flex-col gap-8">

        <div className="flex flex-col gap-3 bg-slate-200 dark:bg-slate-800 p-6 rounded-2xl">

          <label className="text-xl font-semibold">Title</label>
          <input
            value={title}
            maxLength={40}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Discussion title"
            className="bg-slate-100 dark:bg-slate-700 rounded-xl border border-slate-500 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>


        <div className="flex flex-col gap-3 bg-slate-200 dark:bg-slate-800 p-6 rounded-2xl">

          <label className="text-xl font-semibold">Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={150}
            rows={4}
            placeholder="Discussion description"
            className="bg-slate-100 dark:bg-slate-700 rounded-xl border border-slate-500 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        <button className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 dark:bg-rose-600 dark:hover:bg-rose-700 dark:active:bg-rose-800 py-3 rounded-xl font-semibold"
        onClick={handleCreate}>
          Create a Discussion
        </button>

      </div>
      
    </div>
  )
}