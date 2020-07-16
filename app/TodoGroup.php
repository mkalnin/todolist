<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class TodoGroup extends Model
{
    public function todos()
    {
      return $this->hasMany('App\Todo', 'todo_group_id');
    }
}
