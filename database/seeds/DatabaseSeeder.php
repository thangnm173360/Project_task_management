<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

       /* $this->call([
        UsersTableSeeder::class,
        PostsTableSeeder::class,

            ]);*/

        DB::table('users') ->insert([
            'name' => 'admin',
            'email' => 'gnorvene@gmail.com',
            'password' => bcrypt('admin'),

        ]);

        factory(App\Post::class, 50)->create();
        factory(App\User::class, 500)->create();
    }
}
