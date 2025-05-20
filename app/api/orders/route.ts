import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOption";

const BACKEND_URL = process.env.API_BASE_URL;

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(`${BACKEND_URL}/api/orders`, {
    headers: {
      Authorization: `Bearer ${session.user.accessToken}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json(
      { error: errorText || "Failed to fetch orders" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${BACKEND_URL}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.user.accessToken}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    return NextResponse.json(
      { error: errorText || "Failed to create order" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data, { status: 201 });
}
