import type { Message } from "../types/hook.types.js";

export const test_message: Message[] = [
    {
        id: 1,
        content: "Hi there! 👋 How can I help you today?",
        sender: "assistant",
    },
    {
        id: 2,
        content: "Can you help me get started?",
        sender: "user",
    },
    {
        id: 3,
        content:
            "Of course! I can answer questions, explain concepts, and help you explore your options.",
        sender: "assistant",
    },
];

export const suggestions = ["Explain a concept", "Help me code", "Brainstorm ideas"];

