<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['id'];
    protected $hidden = ['deleted_in_id', 'seen_in_id'];

    public const CHAT_TYPE = 'chats';
    public const CHAT_GROUP_TYPE = 'group_chats';

    public function from() 
    {
        return $this->belongsTo(User::class, 'from_id');
    }

    public function to() 
    {
        return $this->morphTo();
    }

    public function another_user() 
    {
        return $this->belongsTo(User::class, 'another_user_id');
    }

    public function attachments() 
    {
        return $this->hasMany(ChatMessageFile::class, 'chat_id');
    }

    /**
     * Bootstrap the model and its traits.
     *
     * @return void
     */
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope('default_sort', function (Builder $builder) {
            $builder->orderBy('sort_id');
        });

        static::creating(function ($model) {
            $model->sort_id = static::max('sort_id') + 1;
            $model->seen_in_id = json_encode([['id' => auth()->id(), 'seen_at' => now()]]);
        });
    }

    public function scopeForUserOrGroup(Builder $query, string $id) 
    {
        $query->where(function (Builder $query) use ($id) {
                $query->where('from_id', auth()->id())
                    ->where('to_id', $id);
            })
            ->orWhere(function (Builder $query) use ($id) {
                $query->where('from_id', $id)
                    ->where('to_id', auth()->id());
            });
    }

    public function scopeDeletedInIds(Builder $query) 
    {
        $query->where(function (Builder $query) {
            $query->whereNull('deleted_in_id')
                  ->orWhereRaw("JSON_SEARCH(deleted_in_id, 'ONE', ?, NULL, '$[*].id') IS NULL", auth()->id());
        });
    }
}
