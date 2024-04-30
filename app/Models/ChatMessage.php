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

    public const SVG_IMAGE_ATTACHMENT = '
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-image" viewBox="0 0 16 16">
            <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
            <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1z"/>
        </svg>';
    public const SVG_FILE_ATTACHMENT = '
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-file-earmark-text-fill" viewBox="0 0 16 16">
            <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0M9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1M4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1z"/>
        </svg>';

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
        $group = GroupMember::where('member_id', auth()->id())
            ->select('member_id', 'group_id')
            ->groupBy('member_id', 'group_id');

        $query->where(function (Builder $query) use ($id) {
                $query->where('from_id', auth()->id())
                      ->where('to_id', $id);
            })
            ->orWhere(function (Builder $query) use ($id) {
                $query->where('from_id', $id)
                      ->where('to_id', auth()->id());
            })
            ->orWhere(function (Builder $query) use ($id, $group) {
                $query->where('to_type', ChatGroup::class)
                      ->where('to_id', $id)
                      ->whereIn('to_id', $group->pluck('group_id')?->toArray());
            });
    }

    public function scopeDeletedInIds(Builder $query) 
    {
        $query->where(function (Builder $query) {
            $query->whereNull('deleted_in_id')
                  ->orWhereRaw("JSON_SEARCH(deleted_in_id, 'ONE', ?, NULL, '$[*].id') IS NULL", auth()->id());
        });
    }

    public function scopeNotSeen(Builder $query) 
    {
        $query->whereRaw("JSON_SEARCH(seen_in_id, 'ONE', ?, NULL, '$[*].id') IS NULL", auth()->id());
    }
}
