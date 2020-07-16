<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('todo-group')->group(function () {
  Route::get('', 'TodoGroupController@index');
  Route::post('create', 'TodoGroupController@create');
});

Route::prefix('todo')->group(function () {
  Route::get('', 'TodoController@index');
  Route::post('create', 'TodoController@create');
  Route::post('update', 'TodoController@update');
  Route::post('toggle-complete', 'TodoController@toggleComplete');
  Route::delete('', 'TodoController@delete');
});
