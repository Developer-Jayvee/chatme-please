<?php

namespace App\Jobs;

use App\Models\Conversation;
use App\Services\ModelService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SummaryModelJob implements ShouldQueue
{
    use Queueable;

    const MAX_CONVO_LENGTH = 20;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Conversation $convo,
        public ModelService $service
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        if (! $this->convo) {
            return;
        }
        $lastSummarizedId = $this->convo->last_message_summary_id ?? 0;
        $fullSummary = $this->convo->summary ?? 'No summary';

        $retrieveRecentData = $this->convo->messages()
            ->where('id', '>', $lastSummarizedId)
            ->orderBy('id', 'asc')
            ->take(self::MAX_CONVO_LENGTH)
            ->get();

        if ($retrieveRecentData->count() < self::MAX_CONVO_LENGTH) {
            return;
        }
        $fullMessages = $retrieveRecentData->map(fn ($msg) => "{$msg->role}: {$msg->content}");

        $response = $this->service->generate(
            prompt: " 
                        Previous Summary: 
                        {$fullSummary}

                        New Conversation Messages
                        {$fullMessages}

                        Update the previous summary using the new conversation messages.
                    ",
            instructions: 'You summarize conversations. Preserve important facts'.
                            'Do not invent information. Return only the updated summary.'
        );

        $this->convo->update([
            'summary' => $response,
            'last_message_summary_id' => $retrieveRecentData->last()->id,
        ]);
    }
}
