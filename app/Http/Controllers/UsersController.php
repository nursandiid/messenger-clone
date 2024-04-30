<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $users = User::whereNot('id', auth()->id())
                ->where('name', 'LIKE', '%'. request('query') .'%')
                ->select('id', 'name')
                ->get();

            return $this->ok($users);
        } catch (\Exception $e) {
            return $this->oops($e->getMessage());
        }
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        DB::beginTransaction();
        try {
            $user = User::find($id);
            if (!$user) {
                throw new \Exception('User not found');
            }

            $user->update($request->only('active_status'));
    
            DB::commit();
            return $this->ok($user);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->oops($e->getMessage());
        }
    }
}
