<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ProjectControllerView;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\PersonalPlanController;

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

// Route::middleware(['auth:sanctum'])->group(function () {
    // Route Project
    Route::apiResource('projects', ProjectController::class);
    Route::get('/projects/deleted/{user_id}', [ProjectController::class, 'getDeletedProjects']);
    Route::delete('/projects/permanently-delete/{id}', [ProjectController::class, 'permanentlyDeleteProject']);
    Route::get('/projects/restore/{id}', [ProjectController::class, 'restoreProject']);

    // Route Projectview (TASK)
    Route::apiResource('project-view', ProjectControllerView::class);
    Route::post('/project-view/{project_id}/tasks', [ProjectControllerView::class, 'createTaskToProject']);
    Route::put('/project-view/{projectId}/tasks/{taskId}', [ProjectControllerView::class, 'updateTaskProject']);
    
    // Route xử lý các task đã bị xóa mềm
    Route::get('/project-view/{projectId}/deleted-tasks', [ProjectControllerView::class, 'getDeletedTasks']);
    Route::put('/project-view/tasks/{taskId}/restore', [ProjectControllerView::class, 'restoreTask']); 
    Route::delete('/project-view/tasks/{taskId}/force-delete', [ProjectControllerView::class, 'forceDeleteTask']); 
    Route::get('/project-view/{project_id}/users', [ProjectControllerView::class, 'getUsersByProject']);

    // Task
    Route::apiResource('tasks', TaskController::class);

    // PersonalPlanController
    Route::apiResource('personal-plans', PersonalPlanController::class);
    Route::put('/personal-plans/{id}/status', [PersonalPlanController::class, 'updateStatus']);
    Route::get('/personal-plans/trashed/{user_id}', [PersonalPlanController::class, 'trashed']);
    Route::post('/personal-plans/{id}/restore', [PersonalPlanController::class, 'restore']);
    Route::delete('/personal-plans/{id}/force-delete', [PersonalPlanController::class, 'forceDelete']);

    // Route User
    Route::apiResource('users', UserController::class);
// });