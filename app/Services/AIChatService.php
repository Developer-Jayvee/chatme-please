<?php

namespace App\Services;

use Gemini\Laravel\Facades\Gemini;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class AIChatService
{
    public function generate(string $prompt)
    {
        $model = config('services.gemini.model');

        $chat = Gemini::generativeModel(model : $model)->startChat();


        return response()->eventStream(function () use($chat,$prompt) {
            $stream  = $chat->streamSendMessage($prompt);
            foreach ($stream as $response) {
                $text = $response->text();

                if($text) yield $text;
            }
        }, headers: [
            'X-Accel-Buffering' => 'no'
        ]);

    }

}
