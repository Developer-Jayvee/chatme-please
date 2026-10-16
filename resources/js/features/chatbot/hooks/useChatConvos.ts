import axios from "axios";
import { useEffect, useState } from "react";

export interface ConvoMessageData {
    id : string;
    conversation_id: string;
    role: "agent" | "user",
    content: string;
    created_at: string;
}
export interface ConvoListData {
    code : string;
    is_open : boolean;
    title : string;
    id: string;
    created_at : string;
    messages: Array<ConvoMessageData>;
    
}
export default function useChatConvos() {
    const [convoList ,setConvoList] = useState<ConvoListData[]>([]);
    const [convoDetails,setConvoDetails] = useState<ConvoListData|undefined>();

    const checkConvoList = async () => {
        const response = await axios.get('recentConvos');
        if(response?.data) {
            setConvoList(response?.data?.data);
        }
        return response?.data;
    }
    const showConvo = async (convoId : string) => {
        const response = await axios.get(`convo/${convoId}/details`);
        return response?.data?.data;
    }
    return { convoList,setConvoList,convoDetails,checkConvoList,showConvo,setConvoDetails }
}