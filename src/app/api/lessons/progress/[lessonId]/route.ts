import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request, { params }: { params: Promise<{ lessonId: string }> }) {
    const session: any = await getServerSession(authOptions);
    const { lessonId } = await params;

    if (!session?.accessToken) {
        return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    try {
        const res = await fetch(`http://localhost:8787/api/v1/lessons/progress/${encodeURIComponent(lessonId)}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${session.accessToken}` },
        });

        if (!res.ok) {
            return NextResponse.json({ error: "No se pudo guardar el progreso" }, { status: res.status });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("Lesson Progress Complete API Error:", error);
        return NextResponse.json({ error: "El servicio no está disponible en este momento." }, { status: 500 });
    }
}
