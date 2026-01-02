<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Hash Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default hash driver that will be used to hash
    | passwords for your application. By default, the bcrypt algorithm is
    | used; however, you remain free to modify this option if you wish.
    |
    */

    'default' => 'bcrypt',

    /*
    |--------------------------------------------------------------------------
    | Hashing Drivers
    |--------------------------------------------------------------------------
    |
    | Here you may specify the configuration options that should be used when
    | passwords are hashed using the application's default driver. A great
    | default has been configured for you and is used for most applications.
    |
    | Supported: "bcrypt", "argon", "argon2id"
    |
    */

    'drivers' => [
        'bcrypt' => [
            'rounds' => env('BCRYPT_ROUNDS', 12),
        ],

        'argon' => [
            'memory' => 65536,
            'threads' => 1,
            'time' => 4,
        ],
    ],

];
