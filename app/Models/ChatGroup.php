<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatGroup extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = ['id'];

    public function creator() 
    {
        return $this->belongsTo(User::class, 'creator_id')->select('id', 'name');
    }

    public function group_members() 
    {
        return $this->hasMany(GroupMember::class, 'group_id');
    }
}
