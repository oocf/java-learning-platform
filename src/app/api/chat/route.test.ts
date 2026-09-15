import { afterEach, describe, expect, it, vi } from "vitest";

const { chatMock } = vi.hoisted(() => ({ chatMock: vi.fn() }));

vi.mock("ollama", () => ({
    Ollama: class {
        chat = chatMock;
    },
}));

import { POST } from "./route";
import { jsonRequest } from "@/test/apiTestUtils";

afterEach(() => {
    vi.resetAllMocks();
});

function chatRequest(body: unknown): Request {
    return jsonRequest("http://localhost/api/chat", body);
}

const VALID_LESSON = {
    cards: [
        { type: "theory", title: "Concepto", content: "Una variable guarda datos." },
    ],
};

describe("POST /api/chat", () => {
    it("returns the parsed lesson when the model answers with valid JSON", async () => {
        chatMock.mockResolvedValue({ message: { content: JSON.stringify(VALID_LESSON) } });

        const res = await POST(chatRequest({ objective: "Declare variables", action: "generate" }));

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(VALID_LESSON);
    });

    it("extracts JSON even when the model adds text around it", async () => {
        chatMock.mockResolvedValue({
            message: { content: `Here you go:\n${JSON.stringify(VALID_LESSON)}\nHope it helps!` },
        });

        const res = await POST(chatRequest({ objective: "Declare variables", action: "generate" }));

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual(VALID_LESSON);
    });

    it("includes the objective in the prompt sent to the model", async () => {
        chatMock.mockResolvedValue({ message: { content: JSON.stringify(VALID_LESSON) } });

        await POST(chatRequest({ objective: "Declare variables", action: "generate" }));

        const sentMessages = chatMock.mock.calls[0][0].messages;
        expect(sentMessages).toHaveLength(1);
        expect(sentMessages[0].content).toContain("Declare variables");
    });

    it("returns 500 when the model answers with invalid JSON", async () => {
        chatMock.mockResolvedValue({ message: { content: "not json at all" } });

        const res = await POST(chatRequest({ objective: "Declare variables", action: "generate" }));

        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.error).toContain("invalid JSON format");
    });

    it("returns 500 when the model call fails", async () => {
        chatMock.mockRejectedValue(new Error("boom"));

        const res = await POST(chatRequest({ objective: "Declare variables", action: "generate" }));

        expect(res.status).toBe(500);
        const body = await res.json();
        expect(body.error).toContain("boom");
    });

    it("returns 400 for an unknown action", async () => {
        const res = await POST(chatRequest({ objective: "Declare variables", action: "delete" }));

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: "Invalid action" });
        expect(chatMock).not.toHaveBeenCalled();
    });
});
