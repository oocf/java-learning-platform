import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSession } = vi.hoisted(() => ({ getServerSession: vi.fn() }));

vi.mock("next-auth", () => ({
    default: vi.fn(() => ({})),
    getServerSession,
}));

vi.mock("next-auth/providers/credentials", () => ({
    default: (config: unknown) => config,
}));

import { GET } from "./route";
import { SESSION_WITH_TOKEN, jsonResponse } from "@/test/apiTestUtils";

const fetchMock = vi.fn();

beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

function requestWith(params: Record<string, string>): Request {
    const query = new URLSearchParams(params).toString();
    return new Request(`http://localhost/api/tutor/explain${query ? `?${query}` : ""}`);
}

describe("GET /api/tutor/explain", () => {
    it("returns 400 when exerciseId is missing", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);

        const res = await GET(requestWith({}));

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: "Exercise ID is required" });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("returns the explanation from the Python tutor service", async () => {
        getServerSession.mockResolvedValue({
            ...SESSION_WITH_TOKEN,
            user: { username: "ana" },
        });
        fetchMock.mockResolvedValue(jsonResponse({ explanation: "Usa un bucle for." }));

        const res = await GET(requestWith({ exerciseId: "42" }));

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ explanation: "Usa un bucle for." });

        const [url, options] = fetchMock.mock.calls[0];
        expect(url).toBe("http://localhost:8000/explain-exercise");
        expect(options.method).toBe("POST");
        expect(JSON.parse(options.body)).toEqual({
            username: "ana",
            student_level: "BEGINNER",
            topic: "Java Basics",
            exercise_description: "Explain the concept for exercise 42",
            constraints: { max_words: 50 },
        });
    });

    it("forwards topic and level query params when provided", async () => {
        getServerSession.mockResolvedValue(null);
        fetchMock.mockResolvedValue(jsonResponse({ explanation: "ok" }));

        await GET(requestWith({ exerciseId: "7", topic: "loops", level: "ADVANCED" }));

        expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({
            username: "anonymous",
            student_level: "ADVANCED",
            topic: "loops",
        });
    });

    it("falls back to a friendly message when the tutor service fails", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockResolvedValue(jsonResponse(null, 500));

        const res = await GET(requestWith({ exerciseId: "42" }));

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            explanation: "Lo siento, el Tutor no está disponible en este momento. Inténtalo más tarde.",
        });
    });

    it("falls back to a friendly message when the tutor service is unreachable", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

        const res = await GET(requestWith({ exerciseId: "42" }));

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            explanation: "Lo siento, el Tutor no está disponible en este momento. Inténtalo más tarde.",
        });
    });
});
