"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";




export default function LoginPage() {
    const [user, setUser] = React.useState({
        email: "",
        password: ""
    })

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            toast.success("Login successful!");
            router.push("/profile");
        } catch (error) {
            console.error("Error logging in:", error);
            toast.error("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col gap-4 items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 border p-8 rounded">
                <h1 className="text-2xl font-bold">Log In</h1>
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
                <button onClick={onLogin} className={`bg-transparent border border-white hover:bg-neutral-800 duration-300 text-white p-2 rounded ${buttonDisabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`} disabled={buttonDisabled}>
                    {loading ? "Loading..." : "Log In"}
                </button>
                <p>
                    Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                </p>
            </div>
        </div>
    )
}