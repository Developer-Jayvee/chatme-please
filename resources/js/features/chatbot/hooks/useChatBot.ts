import { useEffect, useState } from "react";
import type { Message } from "../types/hook.types.js";
import { test_message } from "../data/chatbot.data.js";
import axios from "axios";
import useCheckConvoStatus from "./useCheckConvoStatus.js";
import useChatConvos, { type ConvoListData } from "./useChatConvos.js";
import { streamChat } from "../services/chatbot.service.js";
import { useStream } from "@laravel/stream-react";

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
    const {
        send,
        data: aiResponse,
        clearData
    } = useStream("/chat", {
        onData: (data) => {
            setMessages((previous) => previous.map((n) => n.isComplete && n.role !== "agent" ? n : {
                ...n,
                content: n.content + " "+data,
            }));
        },
        onFinish: () => {
             setMessages((previous) => previous.map((n) => n.isComplete  && n.role !== "agent" ? n : {
                ...n,
                isComplete: true
            }));
        }
    });

    const openConvo = async (convoId: string) => {
        const data: ConvoListData = await showConvo(convoId);
        if (data?.messages) {
            setMessages(
                data.messages.map((n) => ({
                    id: n.id,
                    content: n.content,
                    role: n.role,
                    isComplete: true
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

    const storeUserMessage = async (content: Array<Message>) => {
        const response = await axios.post(
            "/chat/insert",
            { content: content.map((n) => ({...n,message : n.content})) },
            {
                headers: {
                    "X-Convo-ID": convoId,
                },
            },
        );
        const data = response?.data?.data;
        if (data) {
            setMessages(content);
        }
        return data;
    };


    const sendMessage = async (content?: string) => {
        if (!convoId) return;
        const message = (content ?? input).trim();
        if (!message) return;

        const contents: Array<Message> = [
            { role: "user", content: message, id: String(Date.now()), isComplete: true },
            { role: "agent", content: " " , id: String(Date.now()), isComplete: false },
        ];
        await storeUserMessage(contents);
        send({
            prompt: message,
        });
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
