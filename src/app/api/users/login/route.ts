import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel.js"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        // check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.TOKEN_SECRET!,
            { expiresIn: "1h" }
        );

        // ✅ create response object
        const response = NextResponse.json(
            { message: "Login successful", user },
            { status: 200 }
        );

        // ✅ set cookie on response
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });

        return response;

    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
