<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('cheese');

Route::get('/dashboard', function (Request $request) {

    $token = $request->session()->get('sanctum_token');
    
    // Nếu token không tồn tại, chuyển hướng người dùng đến trang đăng nhập
    if (!$token) {
        return redirect()->route('login'); // Đảm bảo có route login
    }

    return Inertia::render('Dashboard',[
        'token' => $token,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/dashboard/{any}', function () {
    return Inertia::render('Dashboard');
})->where('any', '.*');

// Route::middleware('auth')->get('/api/token', function (Request $request) {
//     $token = $request->session()->get('sanctum_token');
//     return response()->json([
//         'token' => $token
//     ]);
// });

require __DIR__.'/auth.php';
