import axios from "axios";
import { api } from "../api";


  export async function handleProcess (projectId?: number, assignmentId?: number) {
            try {
               await api.post(`/assignment/${projectId}/process/${assignmentId}`);
                window.location.reload();
            } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                console.log(backendMessage);
            } else {
                console.log("Unexpected error", err);
            }
            }
    }

    export async function handleFinsih (projectId?: number, assignmentId?: number) {
            try {
               await api.post(`/assignment/${projectId}/finish/${assignmentId}`);
                window.location.reload();
            } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                console.log(backendMessage);
            } else {
                console.log("Unexpected error", err);
            }
            }
    }

    export async function handleDecline (projectId?: number, assignmentId?: number) {
            try {
               await api.post(`/assignment/${projectId}/decline/${assignmentId}`);
                window.location.reload();
            } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const backendMessage = err.response?.data?.message ?? err.message;
                console.log(backendMessage);
            } else {
                console.log("Unexpected error", err);
            }
            }
    }

    export async function handleDelete (projectId?: number, assignmentId?: number) {
        try {
            await api.delete(`/assignment/${projectId}/delete/${assignmentId}`)
            window.location.reload();
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                //const backendMessage = err.response?.data?.message ?? err.message;
            } else 
            {
                console.log("Unexpected error", err);
            }
        }

    }