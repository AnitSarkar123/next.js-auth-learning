import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";
import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

connect();
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password }: { email: string; password: string } = reqBody;
    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter all fields" },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User does not exist Sign Up first" },
        { status: 400 }
      );
    }
    console.log("user exist");
    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials or invalid Password please check" },
        { status: 400 }
      );
    }
    console.log("password match");
    const tokenData = {
      id: user._id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });
    console.log("token generated");

    const response = NextResponse.json(
      {
        message: "Logged in Successfully",
        success: true,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      sameSite: "strict",
    });

    return response;
    return NextResponse.json(
      {
        message: "Logged in Sucessfully",
        sucess: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
