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
        return $this->_service->generate(
            prompt: $request->input('prompt'),
            convo: Conversation::query()->findOrFail($request->input('convo_id'))
        );
    }
}
