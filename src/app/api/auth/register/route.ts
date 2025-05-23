import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		const { name, email, password } = await req.json();

		// Validate input
		if (!name || !email || !password) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email: email.toLowerCase() },
		});

		if (existingUser) {
			return NextResponse.json(
				{ message: "User already exists with this email" },
				{ status: 400 }
			);
		}

		// Hash password
		const hashedPassword = await hash(password, 12);

		// Create user
		const user = await prisma.user.create({
			data: {
				name,
				email: email.toLowerCase(),
				hashedPassword,
				emailVerified: new Date(),
			},
		});

		// Omit sensitive data from response
		const { hashedPassword: _, ...userWithoutPassword } = user;

		return NextResponse.json(
			{ user: userWithoutPassword, message: "User created successfully" },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Registration error:", error);
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
}
