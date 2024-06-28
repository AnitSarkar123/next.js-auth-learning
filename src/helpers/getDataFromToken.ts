// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { request } from "http";

// export const getDataFromToken = (request: NextRequest) => {
//   try {
//     const token = request.cookies.get("token")?.value;
//     if (!token) {
//       return null;
//     }
//     const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
//     return decodedToken.id;
//   } catch (error: any) {
//     throw new Error(error.message);
//   }
// };
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest): string | null => {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return null;
    }
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as {
      id: string;
    };
    return decodedToken.id;
  } catch (error: any) {
    console.error("Error verifying token:", error.message);
    throw new Error(error.message);
  }
};
