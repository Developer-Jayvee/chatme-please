<?php

namespace App\Services;

use App\Models\Conversation;
use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class AIChatService
{
    
    public function generate(Conversation $convo,string $prompt)
    {
        try {
            $model = config('services.gemini.model');
    
            $chat = Gemini::generativeModel(model : $model)->startChat();
            
            return response()->stream(function () use($chat,$prompt) {
                $stream  = $chat->streamSendMessage($prompt);
                foreach ($stream as $response) {
                    $text = $response->text();
    
                    if($text) yield $text;
                }
            }, headers: [
                'X-Accel-Buffering' => 'no'
            ]);
        } catch (\Exception $ex) {
            return response()->json([
                'data' => null,
                'status' => false,
                'message' => $ex->getMessage()
            ],500);
        }

    }

}
