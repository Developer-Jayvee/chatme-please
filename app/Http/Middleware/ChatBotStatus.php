<?php

namespace App\Http\Middleware;

use App\Models\Conversation;
use App\Models\Message;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ChatBotStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $convoId = $request->header('X-Convo-ID');

        if(! $convoId) {
            return response()->json(['data' => null, 'message' => "Conversation transaction required.", 'status' => false],403);
        }

        
        $convo = Message::query()->where('conversation_id',$convoId)->where('role','user');
        if($convo->count() >= 5) {
            return response()->json(['data' => null, 'message' => "Message Exceeded", 'status' => false],403);
        }

        $request->merge(['convo_id' => $convoId]);

        return $next($request);
    }
}
