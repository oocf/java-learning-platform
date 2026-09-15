import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";
import { jsonRequest, jsonResponse } from "@/test/apiTestUtils";

const fetchMock = vi.fn();

beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

const REGISTER_BODY = { username: "ana", email: "ana@mail.com", password: "secret" };

describe("POST /api/register", () => {
    it("forwards the registration payload to the backend", async () => {
        fetchMock.mockResolvedValue(jsonResponse({ token: "jwt-abc" }));

        const res = await POST(jsonRequest("http://localhost/api/register", REGISTER_BODY));

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ token: "jwt-abc" });

        const [, options] = fetchMock.mock.calls[0];
        expect(options.method).toBe("POST");
        expect(JSON.parse(options.body)).toEqual(REGISTER_BODY);
    });

    it("returns the backend error status when the account cannot be created", async () => {
        fetchMock.mockResolvedValue(jsonResponse(null, 409));

        const res = await POST(jsonRequest("http://localhost/api/register", REGISTER_BODY));

        expect(res.status).toBe(409);
        expect(await res.json()).toEqual({
            error: "No se pudo crear la cuenta. ¿El usuario o correo ya existen?",
        });
    });

    it("returns 500 when the backend is unreachable", async () => {
        fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

        const res = await POST(jsonRequest("http://localhost/api/register", REGISTER_BODY));

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({
            error: "El servicio de registro no está disponible en este momento.",
        });
    });

    it("returns 500 when the body is not valid JSON", async () => {
        const badRequest = new Request("http://localhost/api/register", {
            method: "POST",
            body: "not-json",
        });

        const res = await POST(badRequest);

        expect(res.status).toBe(500);
    });
});
