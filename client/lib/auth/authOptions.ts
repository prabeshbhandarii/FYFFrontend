// lib/auth/authOptions.ts

import { PrismaAdapter } from "@auth/prisma-adapter";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

import { CustomPrismaAdapter } from "./prismaAdapter";
import prisma from "@/lib/prisma";
import { error } from "console";

const authOptions = {
    adapter: CustomPrismaAdapter(prisma),
    providers: [
        EmailProvider({
            server: {
                host: process.env.EMAIL_SERVER_HOST,
                port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
                auth: {
                    user: process.env.EMAIL_SERVER_USER,
                    pass: process.env.EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.EMAIL_FROM,
            maxAge: 24 * 60 * 60,
        }),


        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter Your Email" },
                password: { label: "Password", type: "password", placeholder: "Enter Your Password" }
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials?.email
                    }
                })

                if (!user || !user.emailVerified) {
                    throw new Error("User not found or email not verified");
                }

                if (!credentials?.password || !user.password) {
                    throw new Error("Invalid credentials");
                }
                const isValid = await compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error("Invalid credentials");
                }
                return user;
            }
        }),

    ],
    pages: {
        signUp: "/auth/signup",
        verifyRequest: "/auth/verify-request",
        error: "/auth/signin",
    },
    callbacks: {
        async session({ session, user }: { session: any; user: any }) {

            if (session?.user) {
                session.user.id = user.id;
                session.user.emailVerified = user.emailVerified;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
