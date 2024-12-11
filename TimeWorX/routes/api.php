<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\API\ReportController;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\ProjectControllerView;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\PersonalPlanController;
use App\Http\Controllers\API\TaskCommentController;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;
use App\Http\Controllers\API\ReportCommentController;
use App\Http\Controllers\API\CalendarController;
use App\Http\Controllers\API\MeetingController;
use App\Http\Controllers\API\SummaryReportController;

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

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'showCookie']);

// Route::middleware(['auth:sanctum'])->group(function () {
    // Route Project
    Route::apiResource('projects', ProjectController::class)->except(['index']);
    Route::get('/projects/{user_id}/projects-tasks', [ProjectController::class, 'index']);

    Route::get('/projects/deleted/{user_id}', [ProjectController::class, 'getDeletedProjects']);
    Route::delete('/projects/permanently-delete/{id}', [ProjectController::class, 'permanentlyDeleteProject']);
    Route::get('/projects/restore/{id}', [ProjectController::class, 'restoreProject']);
    Route::post('/projects/{projectId}/users', [ProjectController::class, 'addUserToProject']);
    Route::put('/projects/{projectId}/user-role', [ProjectController::class, 'updateUserRoleInProject']);
    Route::get('/projects/statistics/{user_id}', [ProjectController::class, 'getStatisticsOfTasks']);
    Route::post('/projects/{project_id}/statistics', [ProjectController::class, 'getProjectStatistics']);

    Route::delete('/projects/{projectId}/remove-user/{userId}', [ProjectController::class, 'removeUserFromProject']);



    // Route Projectview (TASK)
    Route::apiResource('project-view', ProjectControllerView::class);
    Route::post('/project-view/{project_id}/tasks', [ProjectControllerView::class, 'createTaskToProject']);
    Route::put('/project-view/{projectId}/tasks/{taskId}', [ProjectControllerView::class, 'updateTaskProject']);

    Route::get('/project-view/{projectId}/deleted-tasks', [ProjectControllerView::class, 'getDeletedTasks']);

    Route::put('/project-view/tasks/{taskId}/restore', [ProjectControllerView::class, 'restoreTask']); 
    Route::delete('/project-view/tasks/{taskId}/force-delete', [ProjectControllerView::class, 'forceDeleteTask']); 
    Route::get('/project-view/{project_id}/users', [ProjectControllerView::class, 'getUsersByProject']);

    // Task
    Route::apiResource('tasks', TaskController::class);
    Route::get('/tasks/{projectId}/done', [TaskController::class, 'getDoneTasksByProject']);

    //Task Comment
    Route::apiResource('task-comments', TaskCommentController::class)->except(['index']);
    Route::get('tasks/{taskId}/comments', [TaskCommentController::class, 'index']);
  
    //Route Reports
    Route::apiResource('reports', ReportController::class)->except(['index','update']);
    Route::get('reports/{projectId}/reports', [ReportController::class, 'index']);
    Route::post('reports/{report_id}',[ReportController::class, 'update']);

    // PersonalPlanController
    Route::apiResource('personal-plans', PersonalPlanController::class);
    Route::put('/personal-plans/{id}/status', [PersonalPlanController::class, 'updateStatus']);
    Route::get('/personal-plans/trashed/{user_id}', [PersonalPlanController::class, 'trashed']);
    Route::post('/personal-plans/{id}/restore', [PersonalPlanController::class, 'restore']);
    Route::delete('/personal-plans/{id}/force-delete', [PersonalPlanController::class, 'forceDelete']);

    // Route User
    Route::apiResource('users', UserController::class);
    Route::get('/users/search', [UserController::class, 'search']);
    Route::get('/users/{userId}/tasks', [UserController::class, 'getAllTaskNameToUser'])->where('userId', '[0-9a-fA-F\-]{36}');

     // Xem danh sách bình luận của một báo cáo
    Route::get('/reports/{taskId}/comments/{userId}', [ReportCommentController::class, 'index']);
    Route::post('/reports/{taskId}/comments/{userId}', [ReportCommentController::class, 'store']);
    Route::delete('/reports/delete/{commentId}/{userId}', [ReportCommentController::class, 'destroy']);
    Route::post('/reports/comments/{commentId}/pin', [ReportCommentController::class, 'pinComment']);
    Route::post('/reports/comments/{commentId}/unpin', [ReportCommentController::class, 'unpinComment']);

    Route::post('/calendar/update-event/{eventId}', [CalendarController::class, 'updateEvent']);

    Route::middleware('auth:sanctum')->get('/meetings', [MeetingController::class, 'getUserMeetings']);
    Route::post('/meetings', [MeetingController::class, 'createMeeting']);
    Route::middleware('auth:sanctum')->put('/meetings/{meetingId}', [MeetingController::class, 'updateMeeting']);
    Route::delete('/meetings/{meetingId}', [MeetingController::class, 'deleteMeeting']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/summary-reports', [SummaryReportController::class, 'getSummaryReports']);
        Route::get('/summary-reports/{id}', [SummaryReportController::class, 'getSummaryReportById']);
        Route::post('/summary-reports', [SummaryReportController::class, 'createSummaryReport']);
    });
    
// });