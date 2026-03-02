import { BrowserRouter, Routes, Route, } from "react-router-dom"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import { useEffect, useState } from "react"
import { useAuth } from "./hooks/authHook"

import Dashboard from "./pages/Dashboard"
import MyProjects from "./pages/MyProjects"
import CreateProject from "./pages/CreateProject"
import Project from "./pages/Project"
import Authentication from "./pages/Authentication"
import CreateAssignment from "./pages/CreateAssignment"
import Members from "./pages/Members"
import UserList from "./pages/userList"
import AssignmentPage from "./pages/AssignmentPage"
import InvitePage from "./pages/InvitePage"
import { api } from "./api"
import axios from "axios"
import type { NotificationsType } from "./types/inviteTypes"


function App() {

	const [isExpanded, setIsExpanded] = useState(false);
	const [notifications, setNotifications] = useState<NotificationsType>()

	const {user} = useAuth();


	    useEffect(() => {
        async function getNotifications() {
            try {
                const response = await api.get(`/invite/notifications`)
                setNotifications(response.data)
            } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                console.log(backendMessage)

                } else 
                {
                console.log("Unexpected error", err);

                }
            }
        }

        getNotifications()
	},[])

  return (
		<BrowserRouter>
		<Header title={"fix later"} user={user}  setIsExpanded={() => setIsExpanded(!isExpanded)} notifications={notifications}/>
		<Sidebar isExpanded={isExpanded}/>

		<div className="pt-18 pl-18 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
			<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/myprojects" element={<MyProjects/>}/>
			<Route path="/create" element={<CreateProject/>}/>
			<Route path="/project/:id" element={<Project/>}/>
			<Route path="/auth" element={<Authentication/>}/>
			<Route path="/create/:id" element={<CreateAssignment/>}/>
			<Route path="/members/:id" element={<Members/>}/>
			<Route path="/users/:id" element={<UserList/>}/>
			<Route path=":projectId/assignment/:id" element={<AssignmentPage/>}/>
			<Route path="invites/:id" element={<InvitePage/>}/>
			</Routes>
		</div>
		</BrowserRouter>
  )
}

export default App
