<?php

namespace App\Services;

use App\Models\Conversation;
use Gemini\Laravel\Facades\Gemini;

class AIChatService
{
    public function generate(Conversation $convo, string $prompt)
    {
        try {
            
            $model = config('services.gemini.model');

            $chat = Gemini::generativeModel(model : $model)->startChat();

            $summary = $convo->summary ?? "No summary";
            $fullPrompt = "
                Previous conversation summary:
                {$summary}

                Current User Prompt:
                {$prompt}
            ";


            return response()->stream(function () use ($chat, $fullPrompt) {
                $stream = $chat->streamSendMessage($fullPrompt);
                foreach ($stream as $response) {
                    $text = $response->text();

                    if ($text) {
                        yield $text;
                    }
                }
            }, headers: [
                'X-Accel-Buffering' => 'no',
            ]);
        } catch (\Exception $ex) {
            return response()->json([
                'data' => null,
                'status' => false,
                'message' => $ex->getMessage(),
            ], 500);
        }

    }
}
