import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { getServerSession } = vi.hoisted(() => ({ getServerSession: vi.fn() }));

vi.mock("next-auth", () => ({
    default: vi.fn(() => ({})),
    getServerSession,
}));

vi.mock("next-auth/providers/credentials", () => ({
    default: (config: unknown) => config,
}));

import { POST } from "./route";
import { SESSION_WITH_TOKEN, jsonRequest, jsonResponse } from "@/test/apiTestUtils";

const fetchMock = vi.fn();

beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

const SUBMIT_BODY = { answers: [{ questionId: 1, selectedOptionIndex: 0 }] };

describe("POST /api/quiz/submit", () => {
    it("returns 401 when there is no session", async () => {
        getServerSession.mockResolvedValue(null);

        const res = await POST(jsonRequest("http://localhost/api/quiz/submit", SUBMIT_BODY));

        expect(res.status).toBe(401);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("forwards the answers and the bearer token to the backend", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockResolvedValue(jsonResponse({ level: "BEGINNER", correctCount: 3, totalQuestions: 9 }));

        const res = await POST(jsonRequest("http://localhost/api/quiz/submit", SUBMIT_BODY));

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ level: "BEGINNER", correctCount: 3, totalQuestions: 9 });

        const [, options] = fetchMock.mock.calls[0];
        expect(options.method).toBe("POST");
        expect(options.headers.Authorization).toBe("Bearer test-token-123");
        expect(JSON.parse(options.body)).toEqual(SUBMIT_BODY);
    });

    it("returns the backend error status when the submission fails", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockResolvedValue(jsonResponse(null, 422));

        const res = await POST(jsonRequest("http://localhost/api/quiz/submit", SUBMIT_BODY));

        expect(res.status).toBe(422);
        expect(await res.json()).toEqual({ error: "No se pudo enviar el examen" });
    });

    it("returns 500 when the backend is unreachable", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

        const res = await POST(jsonRequest("http://localhost/api/quiz/submit", SUBMIT_BODY));

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({ error: "El servicio no está disponible en este momento." });
    });
});
