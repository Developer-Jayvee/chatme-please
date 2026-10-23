import { suggestions } from "@/features/chatbot/data/chatbot.data.js";
import useChatBot from "@/features/chatbot/hooks/useChatBot.js";
import type { ChatBotContextData } from "@/features/chatbot/types/context.types.js";
import { createContext, useContext, useEffect } from "react";

export const ChatBotContext = createContext<ChatBotContextData | undefined>(
    undefined,
);
export const useChatBotContext = () => {
    const context = useContext(ChatBotContext);
    if (!context) throw new Error("Context is out of scope");
    return context;
};
export const ChatBotProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const {
        isOpen,
        isMinimized,
        input,
        setIsOpen,
        setIsMinimized,
        setInput,
        sendMessage,
        startNewChat,
        messages,
        convoId,
        checkConvoStatus, isAvailable,
        checkConvoList, convoList, convoDetails, openConvo,
        isGenerating,
        isFetching,
        isStreamError
    } = useChatBot();

    useEffect(() => {
        if (convoId) checkConvoStatus(convoId);
    }, [isAvailable, convoId]);

    useEffect(() => {
        checkConvoList();
    }, [convoId]);
    return (
        <ChatBotContext.Provider
            value={{
                isOpen,
                isMinimized,
                input,
                setIsOpen,
                setIsMinimized,
                setInput,
                sendMessage,
                startNewChat,
                messages,
                suggestions: suggestions,
                convoId,
                isPromptOpen: isAvailable,
                checkConvoStatus,
                convoList,
                convoDetails,
                showConvo: openConvo,
                isGenerating,
                isFetching,
                isStreamError
            }}
        >
            {children}
        </ChatBotContext.Provider>
    );
};
