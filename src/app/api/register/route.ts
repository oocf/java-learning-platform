import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();

        const res = await fetch("http://localhost:8787/api/v1/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password }),
        });

        if (!res.ok) {
            return NextResponse.json({ error: "No se pudo crear la cuenta. ¿El usuario o correo ya existen?" }, { status: res.status });
        }

        return NextResponse.json(await res.json());
    } catch (error) {
        console.error("Register API Error:", error);
        return NextResponse.json({ error: "El servicio de registro no está disponible en este momento." }, { status: 500 });
    }
}
