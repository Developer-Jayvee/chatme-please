<?php

namespace App\Services;

use Gemini\Data\Content;
use Gemini\Laravel\Facades\Gemini;
use Gemini\Resources\GenerativeModel;

class ModelService
{
   private readonly GenerativeModel $model;

   public function __construct() 
   {
        $this->model = Gemini::generativeModel(
            model : config('services.gemini.model')
        );
   }
   public function generate(string $prompt,string|null $instructions = null): string
   {
        $model = $this->model;
        if($instructions !== null) {
            $model = $model->withSystemInstruction(
                Content::parse($instructions)
            );
        }

        return $model->generateContent($prompt)->text();
   }
}
