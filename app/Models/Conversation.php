<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Override;
use Illuminate\Support\Str;
class Conversation extends Model
{
    
    protected $table = 'conversations';
    protected $fillable = [
        'code',
        'title',
        'is_open',
        'summary',
        'last_message_summary_id'
    ];

    #[Override]
    protected static function booted()
    {
        static::creating(function($model) {
            $model->code = Str::random(10)."-".rand(0,10);
        });
    }
    public function messages()
    {
        return $this->hasMany(Message::class,'conversation_id');
    }

}
