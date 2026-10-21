<?php

use App\Http\Controllers\AIChatController;
use App\Http\Controllers\ChatBotController;
use Illuminate\Support\Facades\Route;


Route::get('/',[ChatBotController::class,'index']);
Route::post('/chat/new',[ChatBotController::class,'newChat']);
Route::get('recentConvos',[ChatBotController::class, 'recentConvos']);
Route::get('convo/{convoId}/details',[ChatBotController::class, 'showConvo']);
Route::middleware('convo-status')->post('/chat/insert',[ChatBotController::class, 'insertChat']);
Route::middleware('convo-status')->get('/chat/status', function () {
    return response()->json(['status' => true],200);
});
Route::middleware(["throttle:5,1",'convo-status'])
->withoutMiddleware([\App\Http\Middleware\HandleInertiaRequests::class])
->post('/chat',[AIChatController::class, 'prompt']);
