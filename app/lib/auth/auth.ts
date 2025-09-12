import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function signJWT(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

export function verifyJWT(token: string): JwtPayload | string | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (err) {
    return null; 
  }
}

export function setAuthCookie(token: string) {
  cookies().set("Token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60, 
    path: "/",
  });
}

export function clearAuthCookie() {
  cookies().delete("Token");
}
