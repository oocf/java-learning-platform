import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { NextAuth } = vi.hoisted(() => ({ NextAuth: vi.fn(() => ({})) }));

// Only the NextAuth runtime is stubbed; the credentials provider (and its
// authorize() function) is imported for real so its logic gets exercised.
vi.mock("next-auth", () => ({ default: NextAuth }));

import { authOptions } from "./route";

const fetchMock = vi.fn();

beforeEach(() => {
    vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
    vi.unstubAllGlobals();
});

// The CJS build of next-auth 4.24 replaces the provider's authorize with a
// "() => null" stub and keeps the real one under `options`.
const provider = authOptions.providers[0] as unknown as {
    authorize?: (credentials: unknown) => Promise<unknown>;
    options?: { authorize: (credentials: unknown) => Promise<unknown> };
};
const authorize = provider.options?.authorize ?? provider.authorize!;

describe("credentials authorize", () => {
    it("returns null when username or password are missing", async () => {
        expect(await authorize(null)).toBeNull();
        expect(await authorize({ username: "ana" })).toBeNull();
        expect(await authorize({ password: "secret" })).toBeNull();
        expect(fetchMock).not.toHaveBeenCalled();
    });

    it("returns the backend user enriched with name and username", async () => {
        fetchMock.mockResolvedValue(Response.json({ token: "jwt-abc", email: "ana@mail.com" }));

        const user = await authorize({ username: "ana", password: "secret" });

        expect(user).toEqual({
            token: "jwt-abc",
            email: "ana@mail.com",
            name: "ana",
            username: "ana",
        });

        const [url, options] = fetchMock.mock.calls[0];
        expect(url).toBe("http://localhost:8787/api/v1/auth/authenticate");
        expect(options.method).toBe("POST");
        expect(JSON.parse(options.body)).toEqual({ username: "ana", password: "secret" });
    });

    it("returns null when the backend rejects the credentials", async () => {
        fetchMock.mockResolvedValue(Response.json({ message: "bad credentials" }, { status: 401 }));

        const user = await authorize({ username: "ana", password: "wrong" });

        expect(user).toBeNull();
    });

    it("returns null when the backend is unreachable", async () => {
        fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

        const user = await authorize({ username: "ana", password: "secret" });

        expect(user).toBeNull();
    });
});

describe("auth callbacks", () => {
    it("copies the backend token and user into the jwt", async () => {
        const token: Record<string, unknown> = {};
        const user = { token: "jwt-abc", username: "ana" };

        const result = await authOptions.callbacks!.jwt!({ token, user } as never);

        expect(result.accessToken).toBe("jwt-abc");
        expect(result.user).toEqual(user);
    });

    it("keeps the jwt untouched after sign-in", async () => {
        const token = { accessToken: "jwt-abc" };

        const result = await authOptions.callbacks!.jwt!({ token } as never);

        expect(result).toEqual(token);
    });

    it("exposes the access token on the session", async () => {
        const session: Record<string, unknown> = { user: {} };
        const token = { accessToken: "jwt-abc", user: { username: "ana" } };

        const result = await authOptions.callbacks!.session!({ session, token } as never);

        expect(result.accessToken).toBe("jwt-abc");
        expect(result.user).toEqual({ username: "ana" });
    });
});
