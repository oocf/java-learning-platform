/** Shared helpers for the API route unit tests. */

export const SESSION_WITH_TOKEN = { accessToken: "test-token-123" };

export function jsonResponse(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
    });
}

export function jsonRequest(url: string, body: unknown): Request {
    return new Request(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}
