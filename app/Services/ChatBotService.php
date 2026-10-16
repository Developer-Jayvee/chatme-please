<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;

class ChatBotService
{
    public function startNewConvo(Request $request)
    {
        try {
            $model = Conversation::query()->create(['title' => 'New']);
            return response()->json([
                'data' => $model->fresh(),
                'message' => 'Success',
                'status' => true,
            ]);
        } catch (\Exception $ex) {
            return response()->json(['data' => null, 'message' => $ex->getMessage(), 'status' => false], 500);
        } finally {
            
        }
    }

    public function insertMessage(Conversation $convo, array $content)
    {
        try {
            $response = [];
            foreach ($content as $data) {
                $message = $data['message'];
                $role = $data['role'];

                $chunk = explode(' ', $message);
                $msgModel = Message::query()->where('conversation_id', $convo->id)->where('role', 'user');

                if ($msgModel->count() === 5) {
                    return response()->json(['data' => null, 'message' => 'Message exceeded on this context window', 'status' => false], 401);
                }

                if ($msgModel->count() <= 0) {
                    $convo->update([
                        'title' => $chunk[0],
                    ]);
                }

                $response[] = Message::query()->create([
                    'content' => $message,
                    'conversation_id' => $convo->id,
                    'is_open' => $msgModel->count() !== 4,
                    'role' => $role,

                ]);
            }

            return response()->json([
                'data' => $response,
                'message' => 'Success',
                'status' => true,
            ]);
        } catch (\Exception $ex) {
            return response()->json(['data' => null, 'message' => $ex->getMessage(), 'status' => false], 500);
        }

    }

    public function getRecentConvos(Request $request)
    {
        try {
            $perPage = $request->query('perPage', 20);
            $page = $request->query('page', 1);
            
            $data = collect(Conversation::query()->with('messages')->get());
            $sorted = $data->sortByDesc('created_at');
            return new LengthAwarePaginator(
                $sorted->forPage($page,$perPage)->values(),
                $sorted->count(),
                $perPage,
                $page
            );
        } catch (\Exception $ex) {
            return response()->json(['data' => null, 'message' => $ex->getMessage(), 'status' => false], 500);
        }
    }

    public function showConvo(int $convoId)
    {
        try {
            return response()->json([
                'data' => Conversation::query()->with('messages')->findOrFail($convoId),
                'status' => true
            ]);
        } catch (\Throwable $ex) {
            return response()->json(['data' => null, 'message' => $ex->getMessage(), 'status' => false], 500);
        }
    }
}
