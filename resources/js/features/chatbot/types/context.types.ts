import type { Dispatch, SetStateAction } from "react";
import type { Message } from "./hook.types.js";
import type { ConvoListData } from "../hooks/useChatConvos.js";


export interface ChatBotContextData {
    isOpen : boolean;
    isMinimized: boolean;
    input: string;
    setIsOpen : Dispatch<SetStateAction<boolean>>;
    setIsMinimized : Dispatch<SetStateAction<boolean>>;
    setInput : Dispatch<SetStateAction<string>>;
    sendMessage : (content ?: string ) => Promise<void>;
    startNewChat: () => void;
    messages : Message[];
    suggestions:string[];
    convoId : string|undefined;
    isPromptOpen : boolean;
    checkConvoStatus: (convoId : string) => Promise<void>;
    convoList : ConvoListData[];
    convoDetails: ConvoListData | undefined;
    showConvo: (convoId: string) => Promise<void>;
}
