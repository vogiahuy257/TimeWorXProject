<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The name of the table associated with the model.
     *
     * @var string
     */
    protected $table = 'reports';

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'report_id';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'report_by_user_id',
        'project_id',
        'task_id',
        'completion_goal',
        'today_work',
        'next_steps',
        'issues',
        'isLink'
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the user who created the report.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'report_by_user_id');
    }

    public function files()
    {
        return $this->belongsToMany(File::class, 'report_file', 'report_id', 'file_id');
    }

    public function project()
    {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function task()
    {
        return $this->belongsTo(Task::class, 'task_id', 'task_id');
    }

    /**
     * Get the comments for the report.
     */
    public function comments()
    {
        return $this->hasMany(ReportComment::class, 'report_id', 'report_id');
    }

    /**
     * Lấy tất cả bình luận của báo cáo, phân biệt giữa project manager và staff.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getCommentsWithRole()
    {
        return $this->comments()->with('user')->get()->map(function ($comment) {
            $comment->role = $comment->is_project_manager ? 'Project Manager' : 'Staff';
            return $comment;
        });
    }
}
