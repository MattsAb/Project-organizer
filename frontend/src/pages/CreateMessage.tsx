import { useState } from "react";
import { api } from "../api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import ErrorComponent from "../components/simple_components/ErrorComponent";

export default function CreateMessage () {
    const [body, setBody] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage,setErrorMessage] = useState('');

    const navigate = useNavigate();
    const { id } = useParams()

    const [searchParams] = useSearchParams();
    const name = searchParams.get("name");

    const handleMessage = async () => {
        try {
          await api.post(`message/create/${id}`, {
            body,
            description
          })
          navigate('/');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
              const backendMessage = err.response?.data?.message ?? err.message;
              console.log(backendMessage);
              setErrorMessage(backendMessage);
            } else 
            {
              console.log("Unexpected error");
              setErrorMessage("Unexpected error");
            }
        }
    }

 return (

    <div className="flex flex-col items-center gap-10 px-4 py-10 text-black dark:text-white">

      <div className="w-full max-w-2xl flex flex-col gap-8">

        <div className="flex flex-col gap-3 bg-slate-200 dark:bg-slate-800 p-6 rounded-2xl">

          <label className="text-xl font-semibold mb-3">Message {name}</label>
          <label> Description </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={100}
            rows={2}
            placeholder="Message description"
            className="bg-slate-100 dark:bg-slate-700 rounded-xl border border-slate-500 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label> Body </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={200}
            rows={4}
            placeholder="Message body"
            className="bg-slate-100 dark:bg-slate-700 rounded-xl border border-slate-500 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <ErrorComponent message={errorMessage}/>
        </div>

        <button className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 dark:bg-rose-600 dark:hover:bg-rose-700 dark:active:bg-rose-800 py-3 rounded-xl font-semibold"
        onClick={handleMessage}>
          Send Message
        </button>
      </div>
      
    </div>
  )
}