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

describe("GET /api/quiz", () => {
    it("returns 401 when there is no session", async () => {
        getServerSession.mockResolvedValue(null);

        const res = await GET();

        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ error: "No autenticado" });
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("returns 401 when the session has no access token", async () => {
        getServerSession.mockResolvedValue({});

        const res = await GET();

        expect(res.status).toBe(401);
    });

    it("forwards the access token and passes the backend response through", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockResolvedValue(jsonResponse({ questions: [1, 2, 3] }));

        const res = await GET();

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ questions: [1, 2, 3] });
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:8787/api/v1/quiz", {
            headers: { Authorization: "Bearer test-token-123" },
        });
    });

    it("returns the backend error status when it fails", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockResolvedValue(jsonResponse(null, 503));

        const res = await GET();

        expect(res.status).toBe(503);
        expect(await res.json()).toEqual({ error: "No se pudo cargar el examen" });
    });

    it("returns 500 when the backend is unreachable", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

        const res = await GET();

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({ error: "El servicio no está disponible en este momento." });
    });
});
