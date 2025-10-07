import { connect } from "@/dbConfig/dbConfig"
import User from "@/models/userModel.js"
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


connect()

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        console.log(email, password);

        //check if user exists

        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        //create JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.TOKEN_SECRET!,
            { expiresIn: "1h" }
        );
        return NextResponse.json({ message: "Login successful", token, user }, { status: 200 });

    } catch (error) {
        console.error("Error logging in:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}  