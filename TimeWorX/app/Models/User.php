<?php

namespace App\Models;

//use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens; // Import SoftDeletes trait

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes,HasApiTokens; // Add SoftDeletes trait

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'profile_picture',
        'role', // Add role_id to fillable
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Quan hệ nhiều-nhiều với Task
    public function tasks()
    {
        return $this->belongsToMany(Task::class, 'task_user', 'user_id', 'task_id');
    }

    //đếm số lượng task user đó tham gia
    public function countActiveTasks()
    {
        return $this->tasks()->whereNull('tasks.deleted_at')->count();
    }

     /**
     * Mối quan hệ với bảng `projects` qua bảng trung gian `project_user`.
     * Lấy tất cả các dự án mà người dùng tham gia.
     */
    public function projects()
    {
        return $this->belongsToMany(Project::class, 'project_user')
                    ->withPivot('is_project_manager')
                    ->withTimestamps();
    }

    /**
     * Lấy tất cả các dự án mà người dùng là project manager.
     */
    public function managedProjects()
    {
        return $this->projects()->wherePivot('is_project_manager', true);
    }
}
