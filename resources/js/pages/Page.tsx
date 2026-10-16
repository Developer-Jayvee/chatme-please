import { ChatBotProvider } from "@/context/ChatBotContext.js";
import ChatBot from "./chatbot/ChatBot.js";


export default function Page() {
    return  <ChatBotProvider>
        <ChatBot/>
    </ChatBotProvider>
}