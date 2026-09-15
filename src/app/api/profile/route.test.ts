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

describe("GET /api/profile", () => {
    it("returns 401 when there is no session", async () => {
        getServerSession.mockResolvedValue(null);

        const res = await GET();

        expect(res.status).toBe(401);
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("loads the profile with the bearer token and passes it through", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockResolvedValue(jsonResponse({ username: "ana", level: "INTERMEDIATE", successRate: 66.67 }));

        const res = await GET();

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ username: "ana", level: "INTERMEDIATE", successRate: 66.67 });
        expect(fetchMock).toHaveBeenCalledWith("http://localhost:8787/api/v1/students/me", {
            headers: { Authorization: "Bearer test-token-123" },
        });
    });

    it("returns the backend error status when loading fails", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockResolvedValue(jsonResponse(null, 404));

        const res = await GET();

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ error: "No se pudo cargar el perfil" });
    });

    it("returns 500 when the backend is unreachable", async () => {
        getServerSession.mockResolvedValue(SESSION_WITH_TOKEN);
        fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

        const res = await GET();

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({ error: "El servicio no está disponible en este momento." });
    });
});
