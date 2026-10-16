import axios from "axios";
import { useState } from "react";

export default function useCheckConvoStatus() {
    const [isAvailable, setIsAvailable] = useState<boolean>(true);
    const checkConvoStatus = async (convoId: string) => {
        try {
            const response = await axios.get("/chat/status", {
                headers: {
                    "X-Convo-ID": convoId,
                },
            });
            if(response?.data) setIsAvailable(true); 
            return response?.data;
        } catch (error) {
            setIsAvailable(false)
        }
    };
    return { checkConvoStatus,isAvailable,setIsAvailable };
}
