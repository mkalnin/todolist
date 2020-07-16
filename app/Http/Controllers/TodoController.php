<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\TodoGroup;
use App\Todo;

class TodoController extends Controller
{
  /**
   * Create a new controller instance.
   *
   * @return void
   */
  public function __construct()
  {

  }

  /**
   * Return Todos List
   *
   * @return Todo
   */
  public function index(Request $request)
  {
    $validator = \Validator::make($request->all(), [
      'groupId' => 'required|numeric'
    ]);
    if($validator->fails()) {
      return ['errors' => $validator->errors()];
    }
    return TodoGroup::where('id', $request->groupId)->with('todos')->first();
  }

  /**
   * Create Todo
   * @param Request $request
   *
   * @return Todo
   */
  public function create(Request $request)
  {
    $validator = \Validator::make($request->all(), [
      'groupId' => 'required|numeric',
      'todo'    => 'required|min:1|max:256'
    ]);
    if($validator->fails()) {
      return ['errors' => $validator->errors()];
    }
    $todo = new Todo;
    $todo->todo_group_id = $request->groupId;
    $todo->complete      = 0;
    $todo->todo          = $request->todo;
    $todo->save();
    return $todo;
  }

  /**
   * Update Todo
   * @param Request $request
   *
   * @return void
   */
  public function update(Request $request)
  {
    $validator = \Validator::make($request->all(), [
      'todoId'  => 'required|numeric',
      'todo'    => 'required|min:2|max:256'
    ]);
    if($validator->fails()) {
      return ['errors' => $validator->errors()];
    }
    $todo = Todo::find($request->todoId);
    $todo->todo = $request->todo;
    $todo->save();
    return;
  }

  /**
   * Update Todo Complete
   * @param Request $request
   *
   * @return void
   */
  public function toggleComplete(Request $request)
  {
    $validator = \Validator::make($request->all(), [
      'todoIds'  => 'required|array',
      'value'    => 'sometimes|max:1'
    ]);
    if($validator->fails()) {
      return ['errors' => $validator->errors()];
    }
    $todos = Todo::find($request->todoIds);
    foreach($todos as $todo) {
      $todo->complete = $request->value ? $request->value : !$todo->complete;
      $todo->save();
    }
    return $todos;
  }

  /**
   * Delete Todo
   * @param Request $request
   *
   * @return void
   */
  public function delete(Request $request)
  {
    $validator = \Validator::make($request->all(), [
      'todoIds'  => 'required|array'
    ]);
    if($validator->fails()) {
      return ['errors' => $validator->errors()];
    }
    $todos = Todo::find($request->todoIds);
    foreach($todos as $todo) {
      $todo->delete();
    }
    return;
  }
}
