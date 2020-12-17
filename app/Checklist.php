<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Checklist extends Model
{
    public function task()
    {
        return $this->belongsTo(Task::class);
    }
}
