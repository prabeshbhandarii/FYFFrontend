import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { email, password, name } = body
        // console.log("request body:", email, password, name);
        if (!email || !password) {
            return NextResponse.json({ message: "Email and password required" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json({
                message: "User already exists"
            }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                emailVerified: null,
                name,
            }
        })

        return NextResponse.json({ message: "User created. Check your email for verification." });
    } catch (error) {
        return NextResponse.json({
            message: "Internal Server Error", error: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
    )}
}