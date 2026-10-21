<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Services\ChatBotService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatBotController extends Controller
{
    public function __construct(
        protected ChatBotService $_service
    ) {}
    public function index() 
    {
        return Inertia::render('Page');
    }

    public function newChat(Request $request)
    {
        return $this->_service->startNewConvo($request);
    }

    public function insertChat(Request $request)
    {
        $request->validate([
            'content' => ['string','required'],
            'role' => ['required','in:agent,user'],
        ]);
        return $this->_service->insertMessage(
            convo: Conversation::query()->findOrFail( $request->input('convo_id') ),
            content: $request->input('content'),
            role: $request->input('role')
        );
    }

    public function recentConvos(Request $request)
    {
        return $this->_service->getRecentConvos($request);
    }

    public function showConvo(int $convoId)
    {
        return $this->_service->showConvo($convoId);
    }
  
}
