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

    //lấy ngườ dùng từ xác thực auth của middleware
    $user = $request->user();

    if (!$user) {
        return redirect()->route('login');
    }

     if ($user->tokens->isEmpty()) {
        $token = $user->createToken('timeworx')->plainTextToken;
    }

    //gọi vào trang dashboard và gửi token xác thực đi
    return Inertia::render('Dashboard', [
        'token' => $token ?? null,
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

require __DIR__.'/auth.php';
