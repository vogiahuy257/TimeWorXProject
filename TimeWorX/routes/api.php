<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ProjectControllerView;


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


Route::apiResource('projects', ProjectController::class);

Route::get('/projects/deleted/{user_id}', [ProjectController::class, 'getDeletedProjects']);
Route::delete('/projects/permanently-delete/{id}', [ProjectController::class, 'permanentlyDeleteProject']);
Route::get('/projects/restore/{id}', [ProjectController::class, 'restoreProject']);

Route::apiResource('project-view', ProjectControllerView::class);
