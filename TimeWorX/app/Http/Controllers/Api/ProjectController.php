<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::where('project_manager', Auth::id())->get();
        return response()->json(Project::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_name' => 'required|string|max:100',
            'project_description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'project_priority' => 'nullable|string|max:20',
            'project_status' => 'nullable|string|max:200',
            'project_manager' => 'required|exists:users,id'
        ]);

        $project = Project::create($validated);
        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $project = Project::findOrFail($id);
        return response()->json($project);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $project = Project::findOrFail($id);

        // Check if the authenticated user is the project manager
        if (Auth::id() !== $project->project_manager) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'project_name' => 'required|string|max:100',
            'project_description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date',
            'project_priority' => 'nullable|string|max:20',
            'project_status' => 'nullable|string|max:200',
            'project_manager' => 'required|exists:users,id'
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $project = Project::findOrFail($id);

        // Check if the authenticated user is the project manager
        if (Auth::id() != $project->project_manager) {
            return response()->json(null, 204);
        }

        $project->delete();
        return response()->json(null, 204);
    }
}
