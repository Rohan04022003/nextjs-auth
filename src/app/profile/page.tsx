"use client"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function ProfilePage() {

    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const logout = async (e: any) => {
        e.preventDefault();
        try {
            await axios.get("http://localhost:3000/api/users/logout")
            toast.success("Logged out successfully.")
            router.push("/login")
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        }
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 border p-8 rounded">
                <h1 className="text-2xl font-bold">Profile</h1>
                <p>Welcome to your profile page!</p>
                <hr />
                <button onClick={(e) => logout(e)} className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded mt-2 cursor-pointer">Logout</button>
            </div>
        </div>
    )
}