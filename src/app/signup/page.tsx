"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";




export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: ""
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            toast.success("Signup successful! Please log in.");
            console.log("Signup success", response.data);
            router.push("/login");

            
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error signing up:", error);
            toast.error(error?.response?.data?.error || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 border p-8 rounded">
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="border p-2 rounded"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    className="border p-2 rounded"
                />
                <button onClick={onSignup} className={`bg-transparent border border-white hover:bg-neutral-800 duration-300 text-white px-2 py-1 rounded ${buttonDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`} disabled={buttonDisabled}>
                    {loading ? "Loading..." : "Sign Up"}
                </button>
                <p>
                    Already have an account? <Link href="/login">Log in</Link>
                </p>
            </div>
        </div>
    )
}