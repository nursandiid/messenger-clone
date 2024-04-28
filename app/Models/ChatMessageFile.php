<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
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

    public function scopeDeletedInIds(Builder $query) 
    {
        $query->where(function (Builder $query) {
            $query->whereNull('deleted_in_id')
                  ->orWhereRaw("JSON_SEARCH(deleted_in_id, 'ONE', ?, NULL, '$[*].id') IS NULL", auth()->id());
        });
    }
}
