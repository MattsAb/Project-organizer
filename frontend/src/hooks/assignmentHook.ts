import axios from "axios";
import { api } from "../api";

export async function handleProcess( method: "post" | "delete" | "patch" | "put", url: string) {
    try {
        await api({
        method,
        url: `/assignment/${url}`,
        });
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