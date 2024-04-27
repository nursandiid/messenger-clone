<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessageFile extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['id'];
    protected $hidden = ['deleted_in_id'];

    public function sent_by() 
    {
        return $this->belongsTo(User::class, 'sent_by_id')
            ->selectRaw('id, IF (id = ?, "You", name) as name, avatar', [auth()->id()]);
    }
}
