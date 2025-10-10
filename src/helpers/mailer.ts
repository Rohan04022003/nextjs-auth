/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer'
import User from "@/models/userModel"
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config();

export const sendEmail = async ({ email, emailType, userId }: any) => {
    console.log(userId)
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(
                userId,
                { $set: { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 } },
                { new: true, runValidators: true }
            );

        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId,
                {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }
            )
        }

        const transport = nodemailer.createTransport({
            host: process.env.MAILTRAP_HOST,
            port: Number(process.env.MAILTRAP_PORT),
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS

            }
        });

        const mailOptions = {
            from: 'rohanxwebdev@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password.",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`
        }

        const mailResponse = await transport.sendMail(mailOptions)

        return mailResponse;


    } catch (error: any) {
        throw new Error(error.message)
    }

}