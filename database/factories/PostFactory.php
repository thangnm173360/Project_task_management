<?php

use Faker\Generator as Faker;

$factory->define(App\Post::class, function (Faker $faker) {
    return [
        'title'=> $faker->realText(30,2),
        'content' => $faker->realText(500,5)

    ];
});
