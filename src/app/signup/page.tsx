"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { Axios } from "axios";




export default function SignupPage() {
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: ""
    })

    const onSignup = async () => {

    }

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
                <button onClick={onSignup} className="bg-transparent border border-white hover:bg-neutral-800 duration-300 text-white p-2 cursor-pointer rounded">
                    Signup here
                </button>
                <p>
                    Already have an account? <Link href="/login">Log in</Link>
                </p>
            </div>
        </div>
    )
}