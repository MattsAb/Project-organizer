import { useEffect, useState } from "react"
import { useAuth } from "./hooks/authHook"
import { Route, Routes, useNavigate } from "react-router-dom"
import { api } from "./api"
import axios from "axios"

import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
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
import CreateMessage from "./pages/CreateMessage"
import MessagePage from "./pages/MessageListPage"
import MessageInfo from "./pages/MessageInfo"

import type { NotificationsType } from "./types/inviteTypes"


function App() {

	const [title, setTitle] = useState('');
	const [isExpanded, setIsExpanded] = useState(false);
	const [notifications, setNotifications] = useState<NotificationsType>()

	const {user, loading} = useAuth();
	const navigate = useNavigate();

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

	useEffect(() => {
		if (user === null && !loading) {
			navigate("/auth");
		}
	}, [user, navigate, loading]);

  return (
	<>
		<Header title={title} 
		user={user}  
		setIsExpanded={() => setIsExpanded(!isExpanded)} 
		notifications={notifications}
		/>
		<Sidebar  onClose={() => setIsExpanded(false)} isExpanded={isExpanded}/>

		<div className="pt-18 md:pl-18 min-h-screen bg-gray-200 dark:bg-gray-900 text-black dark:text-white">
			<Routes>
			<Route path="/" element={<Dashboard />} />
			<Route path="/myprojects" element={<MyProjects/>}/>
			<Route path="/create" element={<CreateProject/>}/>
			<Route path="/project/:id" element={<Project setTitle={setTitle}/>}/>
			<Route path="/auth" element={<Authentication/>}/>
			<Route path="/create/:id" element={<CreateAssignment/>}/>
			<Route path="/members/:id" element={<Members/>}/>
			<Route path="/users/:id" element={<UserList/>}/>
			<Route path=":projectId/assignment/:id" element={<AssignmentPage/>}/>
			<Route path="invites/:id" element={<InvitePage/>}/>
			<Route path="/message/:id"  element={<CreateMessage/>}/>
			<Route path="/messages"  element={<MessagePage/>}/>
			<Route path="/messageinfo/:id"  element={<MessageInfo/>}/>
			</Routes>
		</div>
	</>
  )
}

export default App
