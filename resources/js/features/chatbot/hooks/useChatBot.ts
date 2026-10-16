import { useState } from "react";
import type { Message } from "../types/hook.types.js";
import { test_message } from "../data/chatbot.data.js";
import axios from "axios";
import useCheckConvoStatus from "./useCheckConvoStatus.js";
import useChatConvos, { type ConvoListData } from "./useChatConvos.js";
import { streamChat } from "../services/chatbot.service.js";

interface ContentData {
    role: "agent" | "user";
    message: string;
}
export default function useChatBot() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isMinimized, setIsMinimized] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [convoId, setConvoId] = useState<string | undefined>();
    const { checkConvoStatus, isAvailable } = useCheckConvoStatus();
    const { checkConvoList, convoList, convoDetails, showConvo } =
        useChatConvos();

    const openConvo = async (convoId: string) => {
        const data: ConvoListData = await showConvo(convoId);
        if (data?.messages) {
            setMessages(
                data.messages.map((n) => ({
                    id: n.id,
                    content: n.content,
                    sender: n.role,
                })),
            );
            setConvoId(data.id);
        }
    };

    const startNewChat = async () => {
        const response = await axios.post("/chat/new", {});
        const data = response?.data?.data;

        setConvoId(data?.id);
        setMessages([]);
        setInput("");
    };

    const storeUserMessage = async (content: Array<ContentData>) => {
        const response = await axios.post(
            "/chat/insert",
            { content },
            {
                headers: {
                    "X-Convo-ID": convoId,
                },
            },
        );
        const data = response?.data?.data;
        if (data) {
            const userMessage = content.find(({ role }) => role === "user");
            setMessages((previous) => [
                ...previous,
                {
                    id: String(Date.now()),
                    content: userMessage?.message ?? input,
                    sender: "user",
                },
            ]);
        }
        return data;
    };
    const sendMessage = async (content?: string) => {
        if (!convoId) return;
        const message = (content ?? input).trim();
        if (!message) return;

        await streamChat(
            message,
            (chunk) => {
                console.log(chunk);
                
                setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = {
                        ...next[next.length - 1],
                        text: next[next.length - 1].text + chunk,
                    };
                    return next;
                });
            },
            () => {},
        );
        const response = await axios.post("/chat", {
            prompt: message,
        });
        // const data = response?.data;
        // const data = "Hello";
        // if (!data?.response) return;
        // setMessages((previous) => [
        //     ...previous,
        //     {
        //         id: String(Date.now()),
        //         content: data?.response,
        //         sender: "agent",
        //     },
        // ]);

        // const contents: Array<ContentData> = [
        //     { role: "agent", message: data?.response },
        //     { role: "user", message: message },
        // ];
        // await storeUserMessage(contents);
        setInput("");
    };

    return {
        isOpen,
        setIsOpen,
        isMinimized,
        setIsMinimized,
        input,
        setInput,
        messages,
        setMessages,
        sendMessage,
        startNewChat,
        convoId,
        setConvoId,
        checkConvoStatus,
        isAvailable,
        checkConvoList,
        convoList,
        convoDetails,
        showConvo,
        openConvo,
    };
}
