<?php

namespace App\Http\Controllers;

use App\Http\Requests\GroupRequest;
use App\Models\ChatGroup;
use App\Models\ChatMessage;
use App\Models\GroupMember;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GroupController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(GroupRequest $request)
    {
        DB::beginTransaction();
        try {
            $request->validated();

            $avatar = "/images/group-avatar.png";
            if ($request->hasFile('avatar')) {
                $avatar = upload_file($request->file('avatar'), 'group');
            }

            /**
             * @var ChatGroup $group
             */
            $group = ChatGroup::create([
                'name' => $request->name,
                'avatar' => $avatar,
                'description' => $request->description,
                'creator_id' => auth()->id()
            ]);

            $groupMembers = collect([auth()->id(), ...$request->group_members])
                ->map(fn ($member_id) => compact('member_id'));

            $group->group_members()->createMany($groupMembers);

            $chat = ChatMessage::create([
                'from_id' => auth()->id(),
                'to_id' => $group->id,
                'to_type' => ChatGroup::class,
                'body' => 'created group "'. $group->name .'"'
            ]);

            $from = auth()->user();
            $toMembers = User::whereIn('id', $request->group_members)->get();

            foreach ($toMembers as $to) {
                event(new \App\Events\SendMessage($from, $to, $chat));
            }
    
            DB::commit();

            return to_route('chats.show', $group->id);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with([
                'error_msg' => $e->getMessage()
            ]);
        }
    }

    public function members(string $id) 
    {
        try {
            $group = ChatGroup::find($id);
            if (!$group) {
                throw new \Exception('Group not found');
            }

            $members = GroupMember::join('users', 'users.id', 'group_members.member_id')
                ->where('group_id', $id)
                ->whereNot('member_id', $group->creator_id)
                ->select('users.id', 'users.name', 'group_members.group_id')
                ->get();

            return $this->ok($members);
        } catch (\Exception $e) {
            return $this->oops($e->getMessage());
        }
    }

    public function update(GroupRequest $request, string $id)
    {
        DB::beginTransaction();
        try {
            $request->validated();
            
            $group = ChatGroup::find($id);
            if (!$group) {
                throw new \Exception('Group not found');
            }

            $avatar = $group->avatar;
            if ($request->hasFile('avatar')) {
                $avatar = upload_file($request->file('avatar'), 'group');
            }

            /**
             * @var ChatGroup $group
             */
            $group->update([
                'name' => $request->name,
                'avatar' => $avatar,
                'description' => $request->description
            ]);

            GroupMember::destroy($group->group_members()->pluck('id'));

            $groupMembers = collect([auth()->id(), ...$request->group_members])
                ->map(fn ($member_id) => compact('member_id'));

            $group->group_members()->createMany($groupMembers);

            $chat = ChatMessage::where('to_id', $group->id)->first();
            $chat->update([
                'body' => 'created group "'. $request->name .'"'
            ]);
    
            DB::commit();

            return to_route('chats.show', $group->id);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->with([
                'error_msg' => $e->getMessage()
            ]);
        }
    }

    public function exit(string $id) 
    {
        DB::beginTransaction();
        try {
            $group = ChatGroup::find($id);
            if (!$group) {
                throw new \Exception('Group not found');
            }

            $group->group_members()->where('member_id', auth()->id())->delete();
            if ($group->creator_id === auth()->id() && $group->group_members()->count() > 0) {
                $group->update([
                    'creator_id' => $group->group_members()->first()?->member_id
                ]);
            } else {
                $group->delete();
                ChatMessage::where('to_id', $group->id)->delete();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->oops($e->getMessage());
        }
    }
}
