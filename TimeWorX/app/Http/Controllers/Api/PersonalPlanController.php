<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PersonalPlan;
use Illuminate\Support\Facades\Validator;

class PersonalPlanController extends Controller
{
     /**
     * Display a listing of the personal plans.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $personalPlans = PersonalPlan::all();
        return response()->json($personalPlans);
    }

    /**
     * Store a newly created personal plan in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'plan_name' => 'required|string|max:255',
            'plan_description' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'plan_status' => 'required|string',
            'plan_priority'=>'sometimes|required|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $personalPlan = PersonalPlan::create($request->all());
        return response()->json($personalPlan, 201);
    }

    /**
     * Display the specified personal plan.
     *
     * @param  \App\Models\PersonalPlan  $personalPlan
     * @return \Illuminate\Http\Response
     */
    public function show(PersonalPlan $personalPlan)
    {
        return response()->json($personalPlan);
    }

    /**
     * Update the specified personal plan in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\PersonalPlan  $personalPlan
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request,$id)
    {
        $personalPlan = PersonalPlan::find($id);
        if (!$personalPlan) {
            return response()->json(['error' => 'Personal Plan not found'], 404);
        }
        // Xác thực và cập nhật dữ liệu
        $validatedData = $request->validate([
            'plan_name' => 'sometimes|string|max:255',
            'plan_description' => 'sometimes|nullable|string',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'plan_status' => 'sometimes|required|string',
            'plan_priority' => 'sometimes|required|string',
        ]);

        $personalPlan->update($validatedData);

        return response()->json();
    }

    /**
     * Remove the specified personal plan from storage.
     *
     * @param  \App\Models\PersonalPlan  $personalPlan
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $personalPlan = PersonalPlan::find($id);
        $personalPlan->delete();
        return response()->json();
    }

     /**
     * Update the status of the specified personal plan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function updateStatus(Request $request, $id)
    {
        $personalPlan = PersonalPlan::find($id);

        if (!$personalPlan) {
            return response()->json(['error' => 'Personal Plan not found'], 404);
        }

        // Xác thực dữ liệu cho status
        $validator = Validator::make($request->all(), [
            'plan_status' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Cập nhật trạng thái
        $personalPlan->plan_status = $request->plan_status;
        $personalPlan->save();

        return response()->json();
    }

    public function trashed($user_id)
    {
        $trashedPlans = PersonalPlan::onlyTrashed()->where('user_id', $user_id)->get();
        return response()->json($trashedPlans);
    }

    public function restore($id)
    {
        $personalPlan = PersonalPlan::withTrashed()->find($id);
        if (!$personalPlan) {
            return response()->json(['error' => 'Personal Plan not found'], 404);
        }

        $personalPlan->restore();
        return response()->json(['message' => 'Personal Plan restored successfully.']);
    }

    public function forceDelete($id)
    {
        $personalPlan = PersonalPlan::withTrashed()->find($id);
        if (!$personalPlan) {
            return response()->json(['error' => 'Personal Plan not found'], 404);
        }

        $personalPlan->forceDelete();
        return response()->json(['message' => 'Personal Plan deleted permanently.']);
    }
}
