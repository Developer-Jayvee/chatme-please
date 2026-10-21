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
interface InsertMessageResponseData {
    content: string;
    conversation_id: number;
    created_at: string;
    id: number;
    role:  "agent" | "user";
}

const storeMessage = async ({
    content,
    convoId,
}: {
    content: Message;
    convoId: string;
}): Promise<InsertMessageResponseData> => {
    const response = await axios.post(
        "/chat/insert",
        { content: content.content, role: content.role },
        {
            headers: {
                "X-Convo-ID": convoId,
            },
        },
    );
    return response?.data?.data as InsertMessageResponseData;
};



export default function useChatBot() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isMinimized, setIsMinimized] = useState<boolean>(false);
    const [input, setInput] = useState<string>("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [convoId, setConvoId] = useState<string | undefined>();
    const [streamMessage,setStreamMessage] = useState<string|null>();

    const { checkConvoStatus, isAvailable } = useCheckConvoStatus();
    const { checkConvoList, convoList, convoDetails, showConvo } = useChatConvos();

    console.log(convoId);
    

    const streamAI = useStream("/chat", {
        onBeforeSend: (request) => ({
            ...request,
            headers: {
                "X-Convo-ID": convoId ?? "",
            },

        }),
        onData: (data) => {
            setStreamMessage(prev => prev + data);
        },
        onFinish: async () => {
            if(! streamMessage || !convoId) return;
            const response = await storeMessage({
                content: { role: "agent", content: streamMessage, id: String(Date.now()), isComplete: true  },
                convoId
            });

            if(! response) return;

            setMessages(prev => [
                ...prev,
                {
                    id: String(response.id),
                    content: response.content,
                    role: response.role,
                    isComplete: true
                }
            ]);
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


    const sendMessage = async (content?: string) => {
        if (!convoId) return;
        const message = (content ?? input).trim();
        if (!message) return;


        const response =  await storeMessage({ 
            content: { role: "user", content: message, id: String(Date.now()), isComplete: true  },
            convoId
        });
        if( response ) {
            setMessages(prev => [
                ...prev,
                {
                    id: String(response.id),
                    content: response.content,
                    role: response.role,
                    isComplete: true
                }
            ])
            streamAI.send({
                prompt: message,
            });
        }
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
