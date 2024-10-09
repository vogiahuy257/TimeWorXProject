<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The name of the table associated with the model.
     *
     * @var string
     */
    protected $table = 'projects';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'project_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'project_name',
        'project_description',
        'start_date',
        'end_date',
        'project_priority',
        'project_status',
        'project_manager',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    protected $dates = ['deleted_at'];

    /**
     * Get the user that manages the project.
     */
    public function manager()
    {
        return $this->belongsTo(User::class, 'project_manager');
    }

    /**
     * Scope a query to only include non-deleted projects.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeNonDeleted($query)
    {
        return $query->whereNull('deleted_at');
    }

    /**
     * Update project status based on the task status.
     */
    public function updateProjectStatus()
    {
        $tasks = Task::where('project_id', $this->project_id)->pluck('status_key');

        if ($tasks->contains('verify')) {
            $this->project_status = 'verify';
        } elseif ($tasks->contains('in-progress')) {
            $this->project_status = 'in-progress';
        } elseif ($tasks->contains('to-do')) {
            $this->project_status = 'to-do';
        } else {
            $this->project_status = 'done';
        }
    
        return $this->save();
    }

    /**
     * Count tasks that are late.
     *
     * @return int
     */
    public function countLateTasks()
    {
        return Task::where('project_id', $this->project_id)
                   ->where('is_late', true)
                   ->count();
    }


    /**
     * Count tasks that are near the deadline.
     *
     * @return int
     */
    public function countNearDeadlineTasks()
    {
        return Task::where('project_id', $this->project_id)
                   ->where('is_near_deadline', true)
                   ->count();
    }

    // thông kê
    public function countTasksAndCompleted()
    {
        $totalTasks = Task::withTrashed()
            ->where('project_id', $this->project_id)
            ->count();

        $completedTasks = Task::withTrashed()
            ->where('project_id', $this->project_id)
            ->where('status_key', 'done')
            ->count();

        if( $totalTasks == 0 )
        {
            return "0/0";
        }

        $result = "{$completedTasks}/{$totalTasks}";
        

        return  $result;
    }


}
