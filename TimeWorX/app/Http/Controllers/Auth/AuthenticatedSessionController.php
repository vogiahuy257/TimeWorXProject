<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
       \Log::info(Auth::user());
        $token = Auth::user()->createToken('timeworx')->plainTextToken;

        $request->session()->put('sanctum_token', $token);

        $request->session()->regenerate();

        Auth::guard('web')->login(Auth::user());

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        
        \Log::info('logout');
        $request->session()->forget('sanctum_token');

        $request->session()->invalidate();

        $request->session()->regenerateToken();
        if(Auth::user()->tokens())
        {
            Auth::user()->tokens()->delete();
        }
        
        Auth::guard('web')->logout();
        
       

        return redirect('/');
    }
}
