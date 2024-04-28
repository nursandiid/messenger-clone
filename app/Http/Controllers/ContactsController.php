<?php

namespace App\Http\Controllers;

use App\Models\ChatContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ContactsController extends Controller
{
    public function saveContact(string $id)
    {
        DB::beginTransaction();
        try {
            $contact = ChatContact::create([
                'user_id' => auth()->id(),
                'contact_id' => $id,
                'is_contact_saved' => true
            ]);

            DB::commit();

            return $this->ok($contact);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return $this->oops($e->getMessage());
        }
    }

    public function blockContact(string $id)
    {
        DB::beginTransaction();
        try {
            $contact = ChatContact::where('user_id', auth()->id())
                ->where('contact_id', $id)
                ->first();

            if (!$contact) {
                $contact = ChatContact::create([
                    'user_id' => auth()->id(),
                    'contact_id' => $id,
                    'is_contact_blocked' => true,
                    'is_contact_saved' => false
                ]);
            } else {
                $contact->update([
                    'is_contact_blocked' => true
                ]);
            }

            DB::commit();

            return $this->ok($contact);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return $this->oops($e->getMessage());
        }
    }

    public function unblockContact(string $id)
    {
        DB::beginTransaction();
        try {
            $contact = ChatContact::where('user_id', auth()->id())
                ->where('contact_id', $id)
                ->first();

            if (!$contact) {
                throw new \Exception('Contact not found');
            }

            $contact->delete();

            DB::commit();

            return $this->ok($contact);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return $this->oops($e->getMessage());
        }
    }
}
