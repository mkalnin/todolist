<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\TodoGroup;

class TodoGroupController extends Controller
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
   * Return Todos Group List
   *
   * @return GroupList
   */
  public function index()
  {
    return TodoGroup::select(['id', 'name'])->with('todos')->get();
  }

  /**
   * Return Todos Group List
   * @param Request $request
   *
   * @return TodoGroup
   */
  public function create(Request $request)
  {
    $validator = \Validator::make($request->all(), [
      'name' => 'required|min:2|max:128'
    ]);
    if($validator->fails()) {
      return ['errors' => $validator->errors()];
    }
    $todoGroup = new TodoGroup;
    $todoGroup->name = $request->name;
    $todoGroup->save();
    return $todoGroup;
  }
}
