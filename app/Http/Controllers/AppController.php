<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AppController extends Controller
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
   * Return index view
   *
   * @return Illuminate\Http\Response
   */
  public function index()
  {
    return view('layouts.app');
  }
}
