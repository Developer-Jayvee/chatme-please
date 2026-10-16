
import { CardHeader, CardTitle } from "@/components/ui/card.js";
import { Sparkles } from "lucide-react";

export default function ChatHeader() {
    return (
        <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b border-gray-100 bg-white px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700 text-white">
                <Sparkles className="h-5 w-5" />
              </div>

              <div className="space-y-0.5">
                <CardTitle className="text-base font-semibold tracking-tight text-gray-900">
                  Chat me please
                </CardTitle>
                <p className="text-xs text-gray-500">Your AI conversation</p>
              </div>
            </div>

          </CardHeader>
    )
}