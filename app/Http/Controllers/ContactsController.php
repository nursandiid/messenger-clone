<?php

namespace App\Http\Controllers;

use App\Models\ChatContact;
use App\Traits\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ContactsController extends Controller
{
    use Contact;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $contacts = $this->contacts();

            return Inertia::render('contacts/Index', [
                'contacts' => $contacts
            ]);
        } catch (\Exception $e) {
            return back()->with([
                'error_msg' => $e->getMessage()
            ]);
        }
    }

    public function loadData() 
    {
        try {
            return $this->ok($this->contacts());
        } catch (\Exception $e) {
            return $this->oops($e->getMessage());
        }
    }

    public function saveContact(string $id)
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
                    'is_contact_saved' => true
                ]);
            }

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
                    'is_contact_blocked' => true,
                    'is_contact_saved' => false
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

            $contact->update([
                'is_contact_blocked' => false,
                'is_contact_saved' => true
            ]);

            DB::commit();

            return $this->ok($contact);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return $this->oops($e->getMessage());
        }
    }

    public function destroy(string $id)
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

            return $this->ok(null);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return $this->oops($e->getMessage());
        }
    }
}
