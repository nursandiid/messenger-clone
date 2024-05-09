<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ClearInactiveUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:clear-inactive-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        DB::beginTransaction();
        try {
            $key = 'clear-inactive-users';
            $expiresAt = now()->addSeconds(30);

            if (Cache::has($key)) throw new \Exception("Cache $key already exists");
            
            $users = User::inactive()
                ->select('id', 'is_online')
                ->get()
                ->each(function ($user) {
                    $user->update([
                        'is_online' => false
                    ]);
                });

            if ($users->isNotEmpty()) {
                Cache::put($key, true, $expiresAt);

                event(new \App\Events\UserActivity($users));
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            logger($e->getMessage());
        }
    }
}
