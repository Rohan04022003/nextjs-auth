/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer'
import User from "@/models/userModel"
import bcrypt from 'bcryptjs'

export const sendEmail = async ({ email, emailType, userId }: any) => {

    try {
        const hashedToken = bcrypt.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId,
                {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
            )
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
            port: process.env.MAILTRAP_PORT,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS

            }
        });

        const mailOptions = {
            from: 'rohanxwebdev@gmail.com',
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password.",
            html: `<p>Click <a href="${process.env.domain}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`
        }

        const mailResponse = await transport.sendMail(mailOptions)

        return mailResponse;


    } catch (error: any) {
        throw new Error(error.message)
    }

}