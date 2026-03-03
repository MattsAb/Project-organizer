import { useState } from "react";
import { api } from "../api";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import type { SelectableMembers } from "../types/assignmentTypes";


export default function CreateAssignment () {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [members, setMembers] = useState<SelectableMembers[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
    const [errorMessage,setErrorMessage] = useState('');

    const [membersShown, setMembersShown] = useState(false)

    const navigate = useNavigate();
    const { id } = useParams()

    const handleCreate = async () => {
        try {
          await api.post(`/assignment/create/${id}`, {
            title: title,
            description: description,
            dueDate:  new Date(dueDate),
            assignees: selectedMembers
          })

          navigate(`/project/${id}`);
          
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

    const getMembers = async () => {
        if (membersShown)
        {
          setMembersShown(false);
          return;
        }
        setMembersShown(true)

       try {
          const response = await api.get(`members/${id}`)
          setMembers(response.data.members)
          
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
    <div className="flex">

      <div className="flex flex-col items-center gap-10 px-4 py-10 text-black dark:text-white flex-3">

        <h1 className="text-3xl font-bold">Create an assignment</h1>

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

            <label className="text-xl font-semibold">Due date</label>

            <input
              type='date'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-slate-100 dark:bg-slate-700 rounded-xl border border-slate-500 p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

              <button className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 dark:bg-rose-600 dark:hover:bg-rose-700 dark:active:bg-rose-800 py-3 rounded-xl font-semibold self-baseline px-5 mt-5"
                onClick={getMembers}>
                  Assign members
              </button>

          </div>

          <button className="bg-rose-400 hover:bg-rose-300 active:bg-rose-200 dark:bg-rose-600 dark:hover:bg-rose-700 dark:active:bg-rose-800 py-3 rounded-xl font-semibold"
          onClick={handleCreate}>
            Create an assignment
          </button>

        </div>
        
      </div>
          
        <div className="flex items-center">
          <div className="w-px bg-rose-400 dark:bg-rose-800 h-7/8"></div>
        </div>
      { membersShown && (
      <div className="flex-1 flex">
          <div className="w-full flex flex-col gap-5 mx-10 mt-15">
            {members.map((member) => (
              <button
                key={member.userId}
                className={`
                  py-2 rounded-2xl text-2xl font-semibold cursor-pointer
                  ${selectedMembers.includes(member.userId) ? "dark:bg-rose-500 bg-rose-400" : "dark:bg-slate-800 bg-gray-200"}
                `}
                onClick={() => {
                  setSelectedMembers((prev) =>
                    prev.includes(member.userId)
                      ? prev.filter((id) => id !== member.userId) // remove if already selected
                      : [...prev, member.userId]                  // add if not selected
                  )
                }}
              >
                {member.user.username}
              </button>
            ))}
          </div>
      </div>)}

    </div>
  )
}