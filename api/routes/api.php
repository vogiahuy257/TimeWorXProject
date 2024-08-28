<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/fruits', function (Request $request) {
    return $request->user()->fruits;
})->middleware('auth:sanctum');
