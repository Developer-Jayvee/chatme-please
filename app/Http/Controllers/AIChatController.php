<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAIChatRequests;
use App\Models\Conversation;
use App\Services\AIChatService;
use Illuminate\Http\Request;

class AIChatController extends Controller
{
    public function __construct(
        public AIChatService $_service
    ) {}
    public function prompt(StoreAIChatRequests $request)
    {
        $request->validate([
            'prompt' => ['string','required'],
            'convo_id' => ['required','exists:conversations,id']
        ]);
        return $this->_service->generate(
            prompt: $request->input('prompt'),
            convo: Conversation::query()->findOrFail($request->input('convo_id'))
        );
    }
}
