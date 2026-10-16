import { Card } from "@/components/ui/card.js";
import { Button } from "@/components/ui/button.js";
import { MessageSquare, Plus } from "lucide-react";
import { useChatBotContext } from "@/context/ChatBotContext.js";
import ChatHeader from "./ChatHeader.js";
import ChatContent from "./ChatContent.js";

export default function ChatBot() {
    const { startNewChat,convoList, showConvo } = useChatBotContext();
    return (
        <div className="flex h-dvh w-full flex-col overflow-hidden bg-white">
            <Card className="flex h-dvh min-h-0 w-full flex-1 flex-row overflow-hidden rounded-none border-0 bg-white py-0 shadow-none">
                <aside className="flex w-14 shrink-0 flex-col border-r border-gray-100 bg-gray-50/70 px-2 py-4 sm:w-64 sm:px-4">
                    <Button
                        onClick={startNewChat}
                        className="h-10 w-full justify-center gap-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 sm:justify-start"
                        aria-label="Start New"
                        title="Start New"
                    >
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">Start New</span>
                    </Button>

                    <section className="mt-8">
                        <h2 className="hidden px-2 text-xs font-semibold uppercase tracking-wide text-gray-400 sm:block">
                            Recent Messages
                        </h2>
                        <div className="mt-3 flex items-center justify-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-400 sm:justify-start">
                          
                            <div className="flex flex-col gap-3 ">
                                {
                                    convoList.length > 0 ? convoList.map((data) => (
                                        <button className="flex gap-2 items-center" onClick={() => showConvo(data.id)}>
                                              <MessageSquare className="h-4 w-4 shrink-0" />
                                              <span className="hidden text-xs sm:inline">{data.title}</span>
                                        </button>
                                    )) : ( <span className="hidden text-xs sm:inline">No recent messages</span>)
                                }
                            </div>
                        </div>
                    </section>
                </aside>

                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
                    <ChatHeader />
                    <ChatContent />
                </div>
            </Card>
        </div>
    );
}
