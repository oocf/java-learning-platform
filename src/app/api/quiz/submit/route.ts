import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
    const session: any = await getServerSession(authOptions);

    if (!session?.accessToken) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const res = await fetch("http://localhost:8787/api/v1/quiz/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            return NextResponse.json({ error: "No se pudo enviar el examen" }, { status: res.status });
        }

        return NextResponse.json(await res.json());
    } catch (error) {
        console.error("Quiz Submit API Error:", error);
        return NextResponse.json({ error: "El servicio no está disponible en este momento." }, { status: 500 });
    }
}
