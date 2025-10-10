/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/users/signup/route.ts
import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        // Send verification email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id,
        });

        return NextResponse.json(
            {
                message: "User created successfully",
                success: true,
                savedUser: { _id: savedUser._id, username: savedUser.username, email: savedUser.email },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
