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
import { SESSION_WITH_TOKEN, jsonResponse } from "@/test/apiTestUtils";

const fetchMock = vi.fn();

beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("POST /api/quiz/skip", () => {
    it("returns 401 when there is no session", async () => {
        getServerSession.mockResolvedValue(null);

        const res = await POST();

        expect(res.status).toBe(401);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("calls the skip endpoint with the bearer token and passes the result through", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockResolvedValue(jsonResponse({ level: "BEGINNER", correctCount: 0, totalQuestions: 9 }));

        const res = await POST();

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ level: "BEGINNER", correctCount: 0, totalQuestions: 9 });
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:8787/api/v1/quiz/skip", {
            method: "POST",
            headers: { Authorization: "Bearer test-token-123" },
        });
    });

    it("returns the backend error status when skipping fails", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockResolvedValue(jsonResponse(null, 500));

        const res = await POST();

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({ error: "No se pudo omitir el examen" });
    });

    it("returns 500 when the backend is unreachable", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

        const res = await POST();

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({ error: "El servicio no está disponible en este momento." });
    });
});
