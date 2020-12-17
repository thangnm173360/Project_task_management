<?php

use Illuminate\Database\Seeder;


class UserTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('users') ->insert([
        'name' => 'admin',
        'email' => 'gnorvene@gmail.com',
        'password' => bcrypt('admin'),

        ]);


        factory(App\User::class, 50)->create();

    }
}
