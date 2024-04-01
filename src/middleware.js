import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

const secret = process.env.JWT_SECRET;

export default async function middleware(req) {
  const jwt = req.cookies.get("jwt")?.value;

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  if (
    pathname === "/" ||
    pathname === "/users" ||
    pathname === "/stores" ||
    pathname === "/offers" ||
    pathname === "/profile" ||
    pathname === "/payments"
  ) {
    return await checkJwt(jwt, secret, NextResponse);
  }

  if (pathname === "/login") {
    if (jwt) {
      try {
        await verify(jwt, secret);

        return NextResponse.redirect("http://localhost:3001/");
      } catch (e) {
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}

export async function verify(token, secret) {
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return payload;
}

async function checkJwt(token, secret, NextResponse) {
  if (token === undefined) {
    return NextResponse.redirect("http://localhost:3001/login");
  }

  try {
    const payload = await verify(token, secret);
    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect("http://localhost:3001/login");
  }
}
