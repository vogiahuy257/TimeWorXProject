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
    public function tasks()
    {
        return $this->hasMany(Task::class, 'project_id');
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

        if ($tasks->contains('verify')) 
        {
            $this->project_status = 'verify';
        } 
        elseif ($tasks->contains('in-progress')) 
        {
            $this->project_status = 'in-progress';
        } 
        elseif ($tasks->contains('to-do')) 
        {
            $this->project_status = 'to-do';
        } 
        elseif($tasks->contains('done')) 
        {
            $this->project_status = 'done';
        }
        else
        {
            $this->project_status = "to-do";
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

    /**
     * Mối quan hệ với bảng `users` qua bảng trung gian `project_user`.
     * Lấy tất cả những người dùng tham gia vào dự án.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'project_user', 'project_id', 'user_id')
                    ->withPivot('is_project_manager')
                    ->withTimestamps();
    }

    // Automatically add project manager to the users list
    public static function boot()
    {
        parent::boot();

        static::created(function ($project) 
        {
            try 
            {
                $project->addProjectManagerToUsers();
            } 
            catch (\Exception $e) 
            {
                \Log::info('Error adding project manager: ' . $e->getMessage());
            }
        });
        

        static::updated(function ($project) 
        {
            try
            {
                $project->addProjectManagerToUsers();
            }
            catch (\Exception $e) 
            {
                \Log::info('Error adding project manager: ' . $e->getMessage());
            }
        });
    }


    /**
     * Add the project manager to the users list with 'is_project_manager' set to true.
     */
    public function addProjectManagerToUsers()
    {
        // Kiểm tra xem người quản lý dự án đã có trong danh sách users chưa
        if (!$this->users()->where('user_id', $this->project_manager)->exists()) {
            // Thêm người quản lý vào danh sách users
            $this->users()->attach($this->project_manager, ['is_project_manager' => true]);
        }
    }

    /**
     * Kiểm tra xem người dùng có phải là người quản lý dự án hay không.
     *
     * @param string $user_id
     * @return bool
     */
    public function isUserProjectManager(string $user_id)
    {
        // Kiểm tra xem người dùng có trong danh sách users và có 'is_project_manager' là true không
        return $this->users()->where('user_id', $user_id)
                            ->where('is_project_manager', true)
                            ->exists();
    }

    /**
     * Lấy các dự án đã bị xóa mà người dùng có vai trò project_manager.
     *
     * @param string $user_id
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function scopeDeletedProjectsByUser($query, string $user_id)
    {
        return $query->onlyTrashed()
            ->where(function ($query) use ($user_id) {
                $query->whereHas('users', function ($query) use ($user_id) {
                    $query->where('user_id', $user_id)
                          ->where('is_project_manager', true);
                })
                ->orWhere('project_manager', $user_id);
            });
    }

    /**
     * Đếm số lượng người dùng tham gia dự án.
     *
     * @return int
     */
    public function countProjectUsers()
    {
        return $this->users()->count();
    }

    /**
     * Thống kê trang thái của các task trong project
     *
     */
    public function countTasksByStatus()
    {
        $statusCounts = Task::where('project_id', $this->project_id)
            ->select('status_key')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('status_key')
            ->pluck('count', 'status_key')
            ->toArray();

        // Tính tổng số nhiệm vụ
        $totalCount = array_sum($statusCounts);

        // Trả về tỷ lệ phần trăm cho mỗi trạng thái
        return [
            'to-do' => $totalCount > 0 ? round(($statusCounts['to-do'] ?? 0) / $totalCount * 100, 2) : 0,
            'in-progress' => $totalCount > 0 ? round(($statusCounts['in-progress'] ?? 0) / $totalCount * 100, 2) : 0,
            'verify' => $totalCount > 0 ? round(($statusCounts['verify'] ?? 0) / $totalCount * 100, 2) : 0,
            'done' => $totalCount > 0 ? round(($statusCounts['done'] ?? 0) / $totalCount * 100, 2) : 0,
        ];
    }

}
