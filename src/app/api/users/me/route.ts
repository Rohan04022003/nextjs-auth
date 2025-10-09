/* eslint-disable @typescript-eslint/no-explicit-any */
import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

export async function GET(request: NextRequest) {
    try {
        // Extract userId from token
        const userId = getDataFromToken(request);  // ✅ pass request to helper

        if (!userId) {
            return NextResponse.json(
                { message: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Fetch user from DB (exclude password)
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Send user data in response
        return NextResponse.json(
            {
                message: "User data fetched successfully",
                user
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.log("Error fetching user:", error.message);
        return NextResponse.json(
            { message: "Invalid or expired token" },
            { status: 401 }
        );
    }
}
