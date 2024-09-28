<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ProjectControllerView;
use App\Http\Controllers\API\UserController;


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

//Route Project
Route::apiResource('projects', ProjectController::class);

Route::get('/projects/deleted/{user_id}', [ProjectController::class, 'getDeletedProjects']);
Route::delete('/projects/permanently-delete/{id}', [ProjectController::class, 'permanentlyDeleteProject']);
Route::get('/projects/restore/{id}', [ProjectController::class, 'restoreProject']);

//Route Projectview (TASK)
Route::apiResource('project-view', ProjectControllerView::class);
Route::post('/project-view/{project_id}/tasks', [ProjectControllerView::class, 'createTaskToProject']);
Route::put('/project-view/{projectId}/tasks/{taskId}', [ProjectControllerView::class, 'updateTaskProject']);


//Route User
Route::apiResource('users', UserController::class);