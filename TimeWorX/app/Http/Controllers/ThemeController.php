<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function updateTheme(Request $request)
    {
        $request->validate([
            'dark_mode' => 'required|boolean',
        ]);

        session(['dark_mode' => $request->input('dark_mode')]);

        return response()->json(['success' => true]);
    }

    public function getTheme()
    {
        return response()->json([
            'dark_mode' => session('dark_mode', false),
        ]);
    }
}
