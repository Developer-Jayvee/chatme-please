import { AlertTriangle, Bot, User, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatBotContext } from "@/context/ChatBotContext.js";
import { useEffect } from "react";

export default function ChatContent() {
    const {
        messages,
        sendMessage,
        input,
        setInput,
        isPromptOpen: isAvailable,
        convoId,
        checkConvoStatus,
    } = useChatBotContext();
    useEffect(() => {
        if (messages.length > 0 && convoId) checkConvoStatus(convoId);
    }, [messages]);

    return (
        <CardContent className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white p-0">
            <ScrollArea className="min-h-0 flex-1">
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-8 sm:px-8 sm:py-10">
                    <div className="text-center">
                        <span className="text-xs font-medium text-gray-400">
                            Today
                        </span>
                    </div>

                    {messages.map((message) => {
                        const isUser = message.sender === "user";

                        return (
                            <div
                                key={message.id}
                                className={`flex items-start gap-4 ${
                                    isUser ? "justify-end" : "justify-start"
                                }`}
                            >
                                {!isUser && (
                                    <Avatar className="mt-0.5 h-8 w-8 shrink-0">
                                        <AvatarFallback className="bg-emerald-700 text-white">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}

                                <div
                                    className={`max-w-[85%] wrap-break-word whitespace-pre-wrap text-[15px] leading-7 sm:max-w-[80%] ${
                                        isUser
                                            ? "rounded-3xl bg-gray-100 px-5 py-3 text-gray-900"
                                            : "pt-0.5 text-gray-800"
                                    }`}
                                >
                                    {message.content}
                                </div>

                                {isUser && (
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarFallback className="bg-gray-200 text-gray-700">
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            <div className="shrink-0 bg-white px-4 pb-4 pt-2 sm:px-8 sm:pb-6">
                {!isAvailable && (
                    <div
                        role="alert"
                        className="mx-auto mb-3 flex w-full max-w-3xl items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-950 shadow-sm"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                            <AlertTriangle className="h-5 w-5" />
                        </div>
                        <div className="pt-0.5">
                            <p className="text-sm font-semibold">Chat limit reached</p>
                            <p className="mt-1 text-sm leading-5 text-rose-800">
                                This conversation has reached its maximum prompt limit. Start a new chat to continue.
                            </p>
                        </div>
                    </div>
                )}

                <form
                    onSubmit={(event) => {
                        event.preventDefault();
                        sendMessage();
                    }}
                    className={`
                        ${isAvailable ? "" : "bg-gray-200!"}
                        mx-auto flex w-full max-w-3xl items-center gap-3 rounded-3xl border  bg-white px-4 py-2.5 shadow-sm transition-colors focus-within:border-gray-300 focus-within:shadow-md`}
                >
                    <Input
                        disabled={!isAvailable}
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Message Chat me please"
                        className="disabled:bg-gray-200 disabled:cursor-not-allowed h-10 border-0 bg-transparent px-0 text-[15px] shadow-none placeholder:text-gray-400 focus-visible:ring-0"
                    />

                    <Button
                        type="submit"
                        size="icon"
                        disabled={!input.trim() || !isAvailable}
                        className="disabled:cursor-not-allowed cursor-pointer h-9 w-9 shrink-0 rounded-full bg-gray-900 text-white hover:bg-gray-700"
                        aria-label="Send message"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </Button>
                </form>

                <p className="mx-auto mt-3 max-w-3xl text-center text-[11px] text-gray-400">
                    AI can make mistakes. Check important information.
                </p>
            </div>
        </CardContent>
    );
}
