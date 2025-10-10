/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import Jwt from "jsonwebtoken";
import dotenv  from 'dotenv'

dotenv.config();

export const getDataFromToken = (request: NextRequest) => {

    try {

        const token = request.cookies.get("token")?.value || '';
        const decodedToken: any = Jwt.verify(token, process.env.TOKEN_SECRET! || "");

        return decodedToken.userId;

    } catch (error: any) {
        throw new Error(error.message)
    }

}