/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage() {
    const router = useRouter()

    const [user, setUser] = useState({ username: "", email: "" })
    const [loading, setLoading] = useState(true) // loading state
    const [logoutLoading, setLogoutLoading] = useState(false) // logout loading

    const logout = async (e: any) => {
        e.preventDefault()
        setLogoutLoading(true)
        try {
            await axios.get("http://localhost:3000/api/users/logout")
            toast.success("Logged out successfully.")
            router.push("/login")
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message || "Something went wrong")
        } finally {
            setLogoutLoading(false)
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            try {
                const res = await axios.get("http://localhost:3000/api/users/me")
                setUser({
                    username: res.data?.user?.username || "",
                    email: res.data?.user?.email || ""
                })
                console.log(user)
            } catch (error: any) {
                console.log(error.message)
                toast.error("Failed to fetch user data")
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium">Loading profile...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 border p-8 rounded">
                <h1 className="text-2xl font-bold">Profile</h1>
                <p>Welcome to your profile page!</p>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <hr className="w-full" />
                <button
                    onClick={(e) => logout(e)}
                    disabled={logoutLoading}
                    className={`px-4 py-2 rounded mt-2 cursor-pointer ${logoutLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"}`}
                >
                    {logoutLoading ? "Logging out..." : "Logout"}
                </button>
            </div>
        </div>
    )
}
